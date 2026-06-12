"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Nesprávný email nebo heslo.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="block text-center mb-16">
          <span className="text-2xl font-medium tracking-[-0.02em] uppercase text-[#1a1714]">
            Otisk
          </span>
        </Link>

        <div className="p-10 md:p-12 border border-[#e7dfd2]">
          <h1 className="text-3xl font-medium tracking-[-0.02em] text-[#1a1714] mb-2">Přihlášení</h1>
          <p className="text-sm text-[#57503f] mb-10">
            Přístup do fotografického archivu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170] block">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="VÁŠ@EMAIL.CZ"
                className="w-full bg-transparent border-0 border-b border-[#e7dfd2] py-3 px-0 text-sm tracking-wide focus:ring-0 focus:border-[#1a1714] transition-colors outline-none placeholder:text-[#c4bba9]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170] block">
                Heslo
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-[#e7dfd2] py-3 px-0 text-sm focus:ring-0 focus:border-[#1a1714] transition-colors outline-none placeholder:text-[#c4bba9]"
              />
            </div>

            {error && (
              <p className="text-xs text-[#b2401c] uppercase tracking-[0.18em]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1714] text-[#faf6f0] py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors disabled:opacity-40"
            >
              {loading ? "Přihlašuji…" : "Přihlásit se"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-[#57503f]">
          <Link href="/" className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors">
            ← Zpět do galerie
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
