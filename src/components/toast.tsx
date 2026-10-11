"use client";

import { useEffect, useState } from "react";

/** Global toast — dispatch from anywhere: window.dispatchEvent(new CustomEvent("stepin:toast", { detail: "..." })) */
export function Toast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener("stepin:toast", onToast);
    return () => {
      window.removeEventListener("stepin:toast", onToast);
      clearTimeout(timer);
    };
  }, []);

  if (!msg) return null;
  return (
    <div
      role="status"
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-sm text-surface shadow-winter md:bottom-6"
    >
      {msg}
    </div>
  );
}
