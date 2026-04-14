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
    <header className="bg-[#faf8f4] border-b border-[#e8e4dc] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-5 max-w-screen-2xl mx-auto">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-base md:text-lg font-black font-headline text-black tracking-tighter uppercase"
          onClick={() => setMenuOpen(false)}
        >
          Limited Exposure
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {links.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className={[
                "font-label text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
                active === key
                  ? "text-black"
                  : "text-[#8a8070] hover:text-black",
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
            <span className={["block w-6 h-px bg-black transition-all duration-200", menuOpen ? "rotate-45 translate-y-[6px]" : ""].join(" ")} />
            <span className={["block w-6 h-px bg-black transition-all duration-200", menuOpen ? "opacity-0" : ""].join(" ")} />
            <span className={["block w-6 h-px bg-black transition-all duration-200", menuOpen ? "-rotate-45 -translate-y-[6px]" : ""].join(" ")} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={["md:hidden overflow-hidden transition-all duration-300", menuOpen ? "max-h-64 border-t border-[#e8e4dc]" : "max-h-0"].join(" ")}>
        <nav className="flex flex-col px-6 py-4 bg-[#faf8f4]">
          {links.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={[
                "font-label text-[10px] uppercase tracking-[0.18em] py-4 border-b border-[#e8e4dc] last:border-0 transition-colors",
                active === key ? "text-black" : "text-[#8a8070]",
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
