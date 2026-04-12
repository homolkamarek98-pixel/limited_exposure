"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="font-label text-[10px] uppercase tracking-widest text-outline hidden md:block">
          {session.user?.name ?? session.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
        >
          Odhlásit
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
    >
      Přihlásit
    </Link>
  );
}
