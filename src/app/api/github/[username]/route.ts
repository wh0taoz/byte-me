// GET /api/github/[username] — public GitHub profile + recent repos for the
// profile page. Served from GitHub's REST API; no Supabase involved.
import { NextResponse } from "next/server";

export const maxDuration = 15;

const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/;
const GITHUB_API = "https://api.github.com";

// 1-hour response cache. The usual `export const revalidate` is not allowed
// here (next.config.ts sets cacheComponents), and the demo runs on a single
// localhost process anyway — a module-level TTL cache keeps repeat hits
// instant and away from GitHub's rate limit.
const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { body: unknown; expires: number }>();

type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
};

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "EveryStepCounts",
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username", code: 400 },
      { status: 400 },
    );
  }

  const hit = cache.get(username);
  if (hit && hit.expires > Date.now()) {
    return NextResponse.json(hit.body);
  }

  let userRes: Response;
  try {
    userRes = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: githubHeaders(),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.error("[github] user fetch failed:", e);
    return NextResponse.json(
      { error: "GitHub unavailable", code: 502 },
      { status: 502 },
    );
  }

  if (userRes.status === 404) {
    return NextResponse.json(
      { error: "GitHub user not found", code: 404 },
      { status: 404 },
    );
  }
  if (userRes.status === 403) {
    // GitHub sends 403 for both rate limits and blocked requests — the
    // header tells them apart.
    if (userRes.headers.get("x-ratelimit-remaining") === "0") {
      return NextResponse.json(
        { error: "GitHub rate limit", code: 429 },
        { status: 429 },
      );
    }
    console.error("[github] user fetch forbidden (not rate limit)");
    return NextResponse.json(
      { error: "GitHub refused this request", code: 403 },
      { status: 403 },
    );
  }
  if (!userRes.ok) {
    console.error("[github] user fetch status:", userRes.status);
    return NextResponse.json(
      { error: "GitHub unavailable", code: 502 },
      { status: 502 },
    );
  }

  const user = (await userRes.json()) as GitHubUser;

  // Repos are best-effort: a failure here must not sink the whole profile.
  let recentRepos: {
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    url: string;
  }[] = [];
  try {
    const reposRes = await fetch(
      `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=5`,
      { headers: githubHeaders(), signal: AbortSignal.timeout(8000) },
    );
    if (reposRes.ok) {
      const repos = (await reposRes.json()) as GitHubRepo[];
      recentRepos = repos.map((r) => ({
        name: r.name,
        description: r.description ?? null,
        language: r.language ?? null,
        stars: r.stargazers_count ?? 0,
        url: r.html_url,
      }));
    } else {
      console.error("[github] repos fetch status:", reposRes.status);
    }
  } catch (e) {
    console.error("[github] repos fetch failed:", e);
  }

  const langCounts = new Map<string, number>();
  for (const repo of recentRepos) {
    if (repo.language) {
      langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
    }
  }
  const topLanguages = [...langCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  const body = {
    username: user.login,
    name: user.name ?? null,
    bio: user.bio ?? null,
    avatar_url: user.avatar_url,
    location: user.location ?? null,
    company: user.company ?? null,
    blog: user.blog || null,
    public_repos: user.public_repos ?? 0,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    created_at: user.created_at,
    top_languages: topLanguages,
    recent_repos: recentRepos,
  };

  cache.set(username, { body, expires: Date.now() + CACHE_TTL_MS });
  return NextResponse.json(body);
}
