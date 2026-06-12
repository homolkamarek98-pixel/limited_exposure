"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERRORS: Record<string, string> = {
  Configuration: "Chyba konfigurace serveru.",
  AccessDenied: "Přístup odepřen.",
  Verification: "Ověřovací odkaz vypršel nebo byl již použit.",
  Default: "Při přihlašování došlo k chybě.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error") ?? "Default";
  const message = ERRORS[code] ?? ERRORS.Default;

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-8">
        <Link href="/" className="block">
          <span className="text-2xl font-medium tracking-[-0.02em] uppercase text-[#1a1714]">
            Otisk
          </span>
        </Link>

        <div className="p-10 border border-[#e7dfd2] text-left space-y-6">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#b2401c] block">Chyba přihlášení</span>
          <p className="text-base text-[#1a1714]">{message}</p>
          <Link
            href="/auth/signin"
            className="inline-block bg-[#1a1714] text-[#faf6f0] px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
          >
            Zkusit znovu
          </Link>
        </div>

        <Link href="/" className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors block">
          ← Zpět do galerie
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
