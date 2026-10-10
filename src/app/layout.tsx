import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { PipChat } from "@/components/pip-chat";
import { SiteHeader } from "@/components/site-header";
import { Toast } from "@/components/toast";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.motto}`,
  description:
    "Tech events with a difficulty level, plain-language descriptions and zero judgment. Take the first step.",
  icons: { icon: "/assets/brand/footsteps.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<div className="h-16 border-b-2 border-line" />}>
          <SiteHeader />
        </Suspense>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-10">
          {children}
        </main>
        <footer className="border-t-2 border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted md:px-6">
            <p className="font-semibold text-ink">
              {BRAND.name} — {BRAND.motto}.
            </p>
            <p>
              Working name — final brand coming soon. AI answers may contain mistakes; registration
              always happens on the organizer&apos;s site.
            </p>
          </div>
        </footer>
        <Toast />
        <Suspense fallback={null}>
          <PipChat />
        </Suspense>
      </body>
    </html>
  );
}
