"use client";

import Link from "next/link";
import { useState } from "react";
import AuthButton from "@/components/AuthButton";
import CartButton from "@/components/CartButton";

export default function Nav({ active }: { active?: "gallery" | "photographers" | "about" | "for-photographers" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/gallery", label: "Aktuální nabídka", key: "gallery" },
    { href: "/photographers", label: "Autoři", key: "photographers" },
    { href: "/about", label: "O projektu", key: "about" },
    { href: "/for-photographers", label: "Pro autory", key: "for-photographers" },
  ] as const;

  return (
    <header className="bg-[#faf6ee]/85 backdrop-blur-xl border-b border-[#cfc3ab] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_10px_30px_-18px_rgba(47,42,34,0.35)] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 md:py-7 max-w-screen-2xl mx-auto">
        {/* Wordmark — Jost geometrický sans, architektonický uppercase */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-medium font-headline text-[#2f2a22] uppercase tracking-[0.25em]"
          onClick={() => setMenuOpen(false)}
        >
          Otisk
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {links.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className={[
                "font-label uppercase tracking-[0.12em] text-[13px] transition-colors duration-300",
                active === key
                  ? "text-[#2f2a22] font-semibold border-b-2 border-[#2f2a22] pb-1"
                  : "text-[#57503f] hover:text-[#2f2a22]",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <CartButton />
          <AuthButton />
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={["block w-6 h-px bg-[#2f2a22] transition-all duration-200", menuOpen ? "rotate-45 translate-y-[6px]" : ""].join(" ")} />
            <span className={["block w-6 h-px bg-[#2f2a22] transition-all duration-200", menuOpen ? "opacity-0" : ""].join(" ")} />
            <span className={["block w-6 h-px bg-[#2f2a22] transition-all duration-200", menuOpen ? "-rotate-45 -translate-y-[6px]" : ""].join(" ")} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={["md:hidden overflow-hidden transition-all duration-300", menuOpen ? "max-h-64 border-t border-[#eee7d8]" : "max-h-0"].join(" ")}>
        <nav className="flex flex-col px-6 py-4 bg-[#f7f3ec]">
          {links.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={[
                "font-label uppercase tracking-[0.12em] text-sm py-4 border-b border-[#eee7d8] last:border-0 transition-colors",
                active === key ? "text-[#2f2a22] font-semibold" : "text-[#57503f]",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
