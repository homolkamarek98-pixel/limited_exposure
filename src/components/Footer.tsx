import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#faf6f0] border-t border-[#e7dfd2] w-full">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-10">
        {/* Velký wordmark — typografický podpis stránky */}
        <div className="mb-16 md:mb-20 overflow-hidden">
          <span className="block text-[18vw] md:text-[12rem] leading-[0.85] font-bold tracking-[0.08em] uppercase text-[#1a1714] select-none" aria-hidden>
            Otisk
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16 border-t border-[#e7dfd2] pt-10">
          {/* Brand */}
          <div className="space-y-5 max-w-xs">
            <p className="text-sm text-[#57503f] leading-relaxed">
              Kurátorský výběr limitovaných fotografických edic. Každý tisk certifikován, číslován a podepsán fotografem.
            </p>
            <Link
              href="/gallery"
              className="inline-block border border-[#1a1714] text-[#1a1714] px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a1714] hover:text-[#faf6f0] transition-colors"
            >
              Prohlédnout kolekci →
            </Link>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Kolekce</span>
              <div className="space-y-3">
                <Link href="/gallery" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Aktuální nabídka</Link>
                <Link href="/gallery?tier=RISING_TALENT" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Rising Talents</Link>
                <Link href="/gallery?tier=SIGNATURE" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Signature Series</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Pro autory</span>
              <div className="space-y-3">
                <Link href="/for-photographers" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Pro fotografy</Link>
                <Link href="/for-photographers#prihlaska" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Přihláška</Link>
                <Link href="/photographers" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Autoři v kolekci</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">O projektu</span>
              <div className="space-y-3">
                <Link href="/about" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">O nás</Link>
                <Link href="/about" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Certifikace</Link>
                <Link href="mailto:hello@otisk.gallery" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Kontakt</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Právní</span>
              <div className="space-y-3">
                <Link href="/terms" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Obchodní podmínky</Link>
                <Link href="/privacy" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Ochrana soukromí</Link>
                <Link href="/terms#reklamace" className="block text-xs text-[#57503f] hover:text-[#1a1714] transition-colors">Reklamace</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e7dfd2] pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">
            © {new Date().getFullYear()} Otisk. Všechna práva vyhrazena.
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c4bba9]">
            Originální tisky · Certifikovaná pravost · Pojištěná doprava
          </span>
        </div>
      </div>
    </footer>
  );
}
