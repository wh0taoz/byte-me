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
  icons: { icon: "/assets/brand/scout-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<div className="h-19 border-b-2 border-line-strong" />}>
          <SiteHeader />
        </Suspense>
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 md:px-10 md:py-10">
          {children}
        </main>
        <footer className="border-t-2 border-line-strong">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-6 text-xs text-muted md:px-10">
            <p className="font-semibold text-ink">
              {BRAND.name} — {BRAND.motto}.
            </p>
            <p>
              AI answers may contain mistakes; registration always happens on the organizer&apos;s
              site.
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
