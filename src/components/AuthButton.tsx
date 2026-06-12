"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hidden md:block">
          {session.user?.name ?? session.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors"
        >
          Odhlásit
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors"
    >
      Přihlásit
    </Link>
  );
}
