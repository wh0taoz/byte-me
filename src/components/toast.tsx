"use client";

import { Check } from "lucide-react";
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
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-nav-dark px-4 py-3 text-sm font-semibold text-on-dark shadow-winter md:bottom-6"
    >
      <Check className="size-4 shrink-0" aria-hidden />
      {msg}
    </div>
  );
}
