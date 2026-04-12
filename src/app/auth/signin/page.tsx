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
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="block text-center mb-16">
          <span className="serif-display text-2xl font-black tracking-tighter uppercase">
            Limited Exposure
          </span>
        </Link>

        <div className="bg-surface-container-low p-10 md:p-12 border border-outline-variant/20">
          <h1 className="serif-display text-3xl font-black tracking-tighter mb-2">Přihlášení</h1>
          <p className="font-body text-sm text-on-surface-variant mb-10">
            Přístup do fotografického archivu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold block">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="VÁŠ@EMAIL.CZ"
                className="w-full bg-transparent border-0 border-b border-outline py-3 px-0 font-label text-sm tracking-wide focus:ring-0 focus:border-primary transition-colors outline-none placeholder:text-outline/50"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold block">
                Heslo
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-outline py-3 px-0 font-label text-sm focus:ring-0 focus:border-primary transition-colors outline-none placeholder:text-outline/50"
              />
            </div>

            {error && (
              <p className="font-label text-xs text-error uppercase tracking-widest">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 font-label text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "Přihlašuji…" : "Přihlásit se"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 font-body text-sm text-on-surface-variant">
          <Link href="/" className="font-label text-xs uppercase tracking-widest hover:text-primary transition-colors">
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
