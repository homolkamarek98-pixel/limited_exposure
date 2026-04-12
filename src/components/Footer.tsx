import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f3f3f4] border-t border-[#e8e8e8] mt-24 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full px-6 md:px-12 py-16 md:py-20 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <div className="space-y-6 max-w-xs">
          <div className="text-lg font-black font-headline text-black">Limited Exposure</div>
          <p className="font-body text-sm text-[#474747] leading-relaxed">
            Digitální instituce zaměřená na zachování a propagaci umělecké fotografie.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-8">
          <div className="space-y-4">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#777777] font-bold">Galerie</span>
            <div className="space-y-3">
              <Link href="/" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">The Gallery</Link>
              <Link href="/photographers" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Fotografové</Link>
            </div>
          </div>
          <div className="space-y-4">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#777777] font-bold">Legal</span>
            <div className="space-y-3">
              <Link href="#" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Podmínky</Link>
              <Link href="#" className="block font-label text-xs uppercase tracking-wider text-[#474747] hover:text-black transition-colors">Soukromí</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="font-label text-[10px] uppercase tracking-widest text-[#777777] md:text-right mt-4 md:mt-0">
          © {new Date().getFullYear()} Limited Exposure.<br />
          Curated for the void.
        </div>
      </div>
    </footer>
  );
}
