"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#f7f3ec]">
      <span className="font-label text-xs uppercase tracking-[0.3em] text-[#8e8779] mb-6">Chyba</span>
      <h1 className="serif-display text-4xl md:text-6xl font-semibold text-[#2f2a22] mb-5">Něco se pokazilo</h1>
      <p className="font-body text-[#8e8779] max-w-sm mb-10">
        Omlouváme se — zkuste to prosím znovu, nebo se vraťte na úvod.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="bg-mocha text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Zkusit znovu
        </button>
        <Link
          href="/"
          className="border border-[#2f2a22] text-[#2f2a22] px-10 py-4 font-label text-xs uppercase tracking-widest hover:bg-mocha hover:text-on-primary transition-colors"
        >
          Zpět na úvod
        </Link>
      </div>
    </main>
  );
}
