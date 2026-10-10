# P1 — ML (Gemma + Kaggle) and pitch

You own **how Gemma behaves** and **how we tell the story**. Read `00-TEAM-SPLIT.md` first.

## Your outputs
1. Prompt functions in `src/lib/gemma.ts` (P2 calls them from routes).
2. A public Kaggle notebook + dataset with one result number for the pitch.
3. The pitch deck, demo script and the survey numbers.

---

## 1. Prompts (`src/lib/gemma.ts`) — do these first, by 23:30

Replace the old organiser prompts with these five. Keep `ask()` and `askJSON()`.

| Function | Used by | Model | Output |
| --- | --- | --- | --- |
| `eventSummary(event)` | `GET /api/events/[id]` | quality | JSON `ai_summary` (shape in the team file) |
| `suggestLevel(title, description)` | `POST /api/events` | quality | JSON `{ level, reason }` |
| `explainSystem(level, eventContext?)` | `POST /api/explain` | fast | system prompt string for the chat |
| `simplify(text, level)` | `POST /api/simplify` | fast | plain text |
| `guideDraft(topic)` | optional, for P3's guide pages | quality | markdown |

### The "no judgment" system prompt — this is the brand, spend time on it
Must do:
- Never say or imply a question is basic, obvious, easy, or "simply/just".
- Thank or reward the question naturally, then answer.
- Explain in 2–4 short sentences, one everyday analogy, then one tiny example.
- Match the user's level (beginner / intermediate / expert).
- If the user apologises ("sorry if this is dumb"), reassure in one short phrase, no lecture.
- If an event is in context, connect the answer to that event ("you'll hear this at the API workshop on Friday").
- Unsure → say so; never invent event details.
- Reply in the user's language (Serbian or English).

Test it with these before handing over:
- [ ] "sorry if this is dumb, what's an API?"
- [ ] "what does git push do"
- [ ] "is a hackathon only for programmers?"
- [ ] "šta je backend?" (should answer in Serbian)
- [ ] An expert-level question — answer should not be dumbed down

### Banned words check (cheap quality gate)
After each reply, check for: *simply, just, obviously, easy, basic, everyone knows, of course*. If found, regenerate once. Give P2 a `containsJudgment(text)` helper.

---

## 2. Kaggle (start the notebook by 23:00, publish by 05:00)

Kaggle is required, so give it a measurable job tied to the product: **can Gemma label event difficulty correctly?** This powers the organizer form ("Gemma suggests the level") and answers the plan's risk "organizers mislabel the level."

Notebook outline:
1. **Dataset:** ~150 event descriptions (hackathons, meetups, workshops, talks) labelled beginner / intermediate / expert. Generate drafts with Gemma, then **hand-check every label** (split the checking with P2/P3 for 15 minutes if needed). Include tricky cases: "beginner-friendly" events with jargon-heavy descriptions, expert talks with friendly wording.
2. **Baseline:** keyword rule (e.g. "intro", "no experience" → beginner; "advanced", "production", "deep dive" → expert; else intermediate).
3. **Gemma eval:** `gemma-4-26b-a4b-it` and `gemma-4-31b-it` with the `suggestLevel` prompt. Report accuracy and a confusion matrix.
4. **Second metric (the brand):** run 30 beginner questions through the explain prompt, count replies that contain judgment words, before vs after your system prompt. "Judgment words dropped from X% to Y%" is a great slide.
5. **Optional, only if the GPU queue is short:** LoRA on a small Gemma 4 variant for level labelling; report before/after.
6. **Publish** the dataset ("Tech event difficulty levels") and the notebook publicly. Put both links in the README.

Setup reminders: phone-verified account for GPU; Gemma licence accepted; AI Studio key in **Kaggle Secrets**, never in a cell.

> `kaggle-context.md` from earlier describes the old organiser product — its Kaggle setup notes still apply, the plan above replaces its dataset section.

---

## 3. Pitch (start at 04:00, deck done by 07:00)

**Slides (8 max):**
1. Hook: the survey number about missing events out of fear.
2. Problem: beginners don't know if an event is "for them", don't understand the jargon, are afraid to go alone.
3. Solution: Every Step Counts — levels, plain language, Gemma explains without judgment.
4. **Live demo** (follow the script in the team file).
5. How Gemma is used: summaries, level suggestions, no-judgment chat, say-it-simply. Production plan: open weights self-hosted (cost and tone control).
6. **Kaggle results:** level accuracy (Gemma vs baseline) + judgment words before/after.
7. Market: dev.events, hackathonist, Meetup/Luma — nobody targets people afraid to start. North Star: first-time registrations.
8. Roadmap + business model (free → organizer premium → sponsorships), and close: "Every step counts."

- [ ] Get the real survey numbers from P3 (or whoever sent the form) by 04:00
- [ ] Two timed rehearsals, under the time limit, with P3 driving the laptop
- [ ] Prepare answers for: "How is this different from dev.events?", "Why would organizers use it?", "What if the AI is wrong?" (labeled AI output + organizer confirms the level), "Why Gemma?"

## Your checklist
- [ ] 23:30 Prompts in `gemma.ts`, tested with the 5 questions, pushed to `ml`
- [ ] 23:00 Kaggle notebook running with dataset generation
- [ ] 01:30 Kaggle eval done for level labelling
- [ ] 03:00 Judgment-words metric done
- [ ] 05:00 Notebook + dataset published
- [ ] 07:00 Deck done
- [ ] 08:30 Two rehearsals done
