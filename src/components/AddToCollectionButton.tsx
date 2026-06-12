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
      <div className="w-full bg-[#f3ede3] py-5 px-12 text-[10px] uppercase tracking-[0.2em] text-[#8a8170] text-center border border-[#e7dfd2]">
        {soldOut ? "Edice vyprodána" : "Edice vypršela"}
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div className="w-full py-5 px-12 text-[10px] uppercase tracking-[0.2em] text-[#57503f] text-center border border-[#e7dfd2]">
        Upozornění zaregistrováno ✓
      </div>
    );
  }

  if (state === "notify") {
    return (
      <div className="w-full space-y-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170]">
          Platební brána se spouští brzy. Zanechte email pro první přístup.
        </p>
        <div className="flex gap-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="VÁŠ@EMAIL.CZ"
            className="flex-1 bg-[#f3ede3] border border-[#e7dfd2] border-r-0 py-4 px-4 text-xs tracking-[0.18em] focus:outline-none focus:border-[#1a1714] transition-colors placeholder:text-[#c4bba9]"
          />
          <button
            onClick={() => setState("sent")}
            className="bg-[#1a1714] text-[#faf6f0] px-6 text-[10px] uppercase tracking-[0.18em] hover:bg-[#57503f] transition-colors"
          >
            OK
          </button>
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors"
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
      className="w-full bg-[#1a1714] text-[#faf6f0] py-5 px-12 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
    >
      Přidat do kolekce
    </button>
  );
}
