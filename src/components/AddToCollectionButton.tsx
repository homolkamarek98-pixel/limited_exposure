"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  editionId: string;
  soldOut: boolean;
  expired: boolean;
}

export default function AddToCollectionButton({ editionId, soldOut, expired }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "notify" | "sent">("idle");
  const [email, setEmail] = useState("");

  const unavailable = soldOut || expired;

  if (unavailable) {
    return (
      <div className="w-full bg-surface-container py-5 px-12 font-label text-xs uppercase tracking-[0.2em] font-bold text-outline text-center border border-outline-variant/30">
        {soldOut ? "Edice vyprodána" : "Edice vypršela"}
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div className="w-full bg-surface-container-low py-5 px-12 font-label text-xs uppercase tracking-[0.2em] font-bold text-secondary text-center border border-outline-variant/30">
        Upozornění zaregistrováno ✓
      </div>
    );
  }

  if (state === "notify") {
    return (
      <div className="w-full space-y-3">
        <p className="font-label text-[10px] uppercase tracking-widest text-outline">
          Platební brána se spouští brzy. Zanechte email pro první přístup.
        </p>
        <div className="flex gap-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="VÁŠ@EMAIL.CZ"
            className="flex-1 bg-surface-container-low border border-outline-variant/30 border-r-0 py-4 px-4 font-label text-xs tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-outline/50"
          />
          <button
            onClick={() => setState("sent")}
            className="bg-primary text-on-primary px-6 font-label text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
          >
            OK
          </button>
        </div>
        <button
          onClick={() => setState("idle")}
          className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
        >
          Zrušit
        </button>
      </div>
    );
  }

  function handleClick() {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/listing/${editionId}`);
      return;
    }
    setState("notify");
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-primary text-on-primary py-5 px-12 font-label text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary-container transition-all"
    >
      Přidat do kolekce
    </button>
  );
}
