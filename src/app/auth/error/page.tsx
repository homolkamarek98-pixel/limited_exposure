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
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-8">
        <Link href="/" className="block">
          <span className="serif-display text-2xl font-black tracking-tighter uppercase">
            Limited Exposure
          </span>
        </Link>

        <div className="bg-surface-container-low p-10 border border-outline-variant/20 text-left space-y-6">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary block">Chyba přihlášení</span>
          <p className="font-body text-base">{message}</p>
          <Link
            href="/auth/signin"
            className="inline-block bg-primary text-on-primary px-8 py-4 font-label text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
          >
            Zkusit znovu
          </Link>
        </div>

        <Link href="/" className="font-label text-xs uppercase tracking-widest text-outline hover:text-primary transition-colors block">
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
