import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f3f3f4] border-t border-[#e8e8e8] w-full">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5 max-w-xs">
            <div className="text-lg font-black font-headline text-black tracking-tighter uppercase">Limited Exposure</div>
            <p className="font-body text-sm text-[#474747] leading-relaxed">
              Kurátorský výběr limitovaných fotografických edic. Každý tisk certifikován, číslován a podepsán fotografem.
            </p>
            <Link
              href="/gallery"
              className="inline-block bg-black text-white px-6 py-3 font-label text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Prohlédnout kolekci →
            </Link>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10">
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#777777] font-bold">Kolekce</span>
              <div className="space-y-3">
                <Link href="/gallery" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Aktuální nabídka</Link>
                <Link href="/gallery?tier=RISING_TALENT" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Rising Talents</Link>
                <Link href="/gallery?tier=SIGNATURE" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Signature Series</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#777777] font-bold">Artist Hub</span>
              <div className="space-y-3">
                <Link href="/for-photographers" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Pro fotografy</Link>
                <Link href="/for-photographers#prihlaska" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Přihláška</Link>
                <Link href="/photographers" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Autoři v kolekci</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#777777] font-bold">O projektu</span>
              <div className="space-y-3">
                <Link href="/about" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">O nás</Link>
                <Link href="/about" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Certifikace</Link>
                <Link href="mailto:hello@limitedexposure.cz" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Kontakt</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#777777] font-bold">Legal</span>
              <div className="space-y-3">
                <Link href="/terms" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Obchodní podmínky</Link>
                <Link href="/privacy" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Ochrana soukromí</Link>
                <Link href="/terms#reklamace" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Reklamace</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e0e0e0] pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#777777]">
            © {new Date().getFullYear()} Limited Exposure. Všechna práva vyhrazena.
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-[#aaaaaa]">
            Originální tisky · Certifikovaná pravost · Pojištěná doprava
          </span>
        </div>
      </div>
    </footer>
  );
}
