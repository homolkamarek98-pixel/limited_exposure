import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pro fotografy — Otisk",
  description: "Prodávejte svou tvorbu jako limitovanou edici. Kurátorský výběr, archivní tisk, certifikát pravosti. Vaše tvorba si zaslouží víc než jen lajky.",
};

const benefits = [
  {
    number: "01",
    title: "Chráníme vaši hodnotu.",
    body: "Žádné nekonečné kopie. Každá edice má pevně daný počet kusů — a to určujete vy. Po vyprodání edice se neznovuotevírá. Vaše dílo tím získává sběratelskou hodnotu, která se časem zvyšuje.",
  },
  {
    number: "02",
    title: "Vy tvoříte. My řešíme zbytek.",
    body: "Archivní tisk na Hahnemühle Photo Rag Baryta, certifikát pravosti s vaším podpisem, pojištěná doprava až ke sběrateli. Každý prodej na Otisk je záznamem ve vaší profesionální historii.",
  },
  {
    number: "03",
    title: "Každý prodej buduje vaše jméno.",
    body: "Váš profil na platformě není jen stránka — je to doložitelná sbírka vašich edic. Sběratelé sledují autory, ne jen díla. Čím víc vydání, tím silnější je váš hlas v oboru.",
  },
];

const journey = [
  { step: "1", label: "Přihláška", desc: "Zašlete portfolio. Komise posuzuje do 14 dní." },
  { step: "2", label: "Výběr komisí", desc: "Individuální zpětná vazba. Každé dílo prochází kurátorským procesem." },
  { step: "3", label: "Nastavení edice", desc: "Vy rozhodujete o počtu kusů, formátu a ceně." },
  { step: "4", label: "Archivní tisk", desc: "Tisk na Hahnemühle Photo Rag Baryta v profesionálním ateliéru." },
  { step: "5", label: "Certifikace", desc: "Certifikát s pořadovým číslem a vaším vlastnoručním podpisem." },
  { step: "6", label: "Doručení sběrateli", desc: "Pojištěná zásilka. Vy to neřešíte." },
];

export default function ForPhotographersPage() {
  return (
    <>
      <Nav active="for-photographers" />
      <main>

        {/* ── Hero ───────────────────────────────────────── */}
        <section className="bg-mocha text-[#f7f3ec] px-6 md:px-12 pt-24 md:pt-36 pb-24 md:pb-32">
          <div className="max-w-screen-2xl mx-auto">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#f7f3ec]/30 block mb-12">
              Otisk · Artist Hub
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.92] max-w-4xl mb-12">
              Vaše tvorba si zaslouží víc než jen lajky.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#fdfbf6]/10 pt-12">
              <div className="md:col-span-5">
                <p className="font-body text-xl md:text-2xl leading-relaxed text-[#f7f3ec]/80">
                  Fotografie je v Česku nedoceněná. My to měníme — vracíme jí hmotnou podstatu, limitaci a sběratelskou úctu.
                </p>
              </div>
              <div className="md:col-span-5 md:col-start-8 flex flex-col justify-between gap-8">
                <p className="font-body text-base leading-relaxed text-[#f7f3ec]/50">
                  Otisk není obchod s obrázky. Je to standard — kurátorský a výrobní proces, který zaručuje, že každý tisk z naší platformy je originál s doložitelnou hodnotou.
                </p>
                <div>
                  <Link
                    href="#prihlaska"
                    className="inline-block border border-[#fdfbf6]/30 text-[#f7f3ec] px-10 py-5 font-label text-xs uppercase tracking-widest hover:bg-[#fdfbf6] hover:text-[#2f2a22] transition-colors"
                  >
                    Staňte se součástí výběru →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ───────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-[#f7f3ec]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#8e8779] block mb-4">Pro autory</span>
              <h2 className="font-headline text-4xl md:text-5xl font-semibold tracking-tighter">Co z toho máte.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#eee7d8]">
              {benefits.map(({ number, title, body }, i) => (
                <div
                  key={number}
                  className={["p-8 md:p-10 space-y-5 bg-[#fdfbf6]", i < 2 ? "border-b md:border-b-0 md:border-r border-[#eee7d8]" : ""].join(" ")}
                >
                  <div className="font-headline text-5xl font-semibold text-[#f4efe4] leading-none">{number}</div>
                  <h3 className="font-headline text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="font-body text-sm text-[#4a443a] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Manifest ───────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-mocha text-[#f7f3ec]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#f7f3ec]/30 block mb-8">Proč to děláme</span>
              <p className="font-body text-2xl md:text-3xl leading-relaxed text-[#f7f3ec]/90 mb-6">
                „Fotografie je v Česku nedoceněná. Ne proto, že lidé nemají vkus — ale proto, že trh nenabídl správný rámec.“
              </p>
              <p className="font-body text-base leading-relaxed text-[#f7f3ec]/50 max-w-2xl">
                Otisk ten rámec vytváří. Každá edice je limitovaná. Každý tisk je certifikovaný. Každý autor je prověřený. Nejde o obchod — jde o standard, který české fotografii dlouho chyběl.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cesta díla ─────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-[#fdfbf6]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#8e8779] block mb-4">Proces</span>
              <h2 className="font-headline text-4xl md:text-5xl font-semibold tracking-tighter">Cesta díla — od vás ke sběrateli.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-[#eee7d8]">
              {journey.map(({ step, label, desc }, i) => (
                <div
                  key={step}
                  className={[
                    "p-6 space-y-3",
                    i < journey.length - 1 ? "border-b md:border-b-0 md:border-r border-[#eee7d8]" : "",
                    /* mobile: only right border for odd items */
                    "md:last:border-r-0",
                  ].join(" ")}
                >
                  <div className="w-8 h-8 bg-mocha text-[#f7f3ec] flex items-center justify-center">
                    <span className="font-label text-[10px] font-semibold">{step}</span>
                  </div>
                  <h3 className="font-headline text-sm font-semibold uppercase tracking-tight">{label}</h3>
                  <p className="font-body text-xs text-[#8e8779] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Badge / Certified seal ──────────────────────── */}
        <section className="py-24 md:py-32 bg-[#f7f3ec]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="font-label text-[10px] uppercase tracking-widest text-[#8e8779] block">Certifikovaný autor</span>
                <h2 className="font-headline text-4xl md:text-5xl font-semibold tracking-tighter leading-tight">
                  Pečeť, která říká víc než bio na Instagramu.
                </h2>
                <p className="font-body text-base text-[#4a443a] leading-relaxed max-w-md">
                  Každý autor na Otisk získává digitální badge „Certified by Otisk“. Sdílejte ji na svém webu, portfoliu nebo Instagramu — jako doklad, že vaše tvorba prošla profesionálním výběrem.
                </p>
                <Link
                  href="#prihlaska"
                  className="inline-block bg-mocha text-[#f7f3ec] px-10 py-5 font-label text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  Staňte se součástí výběru →
                </Link>
              </div>

              {/* Badge visual */}
              <div className="flex items-center justify-center py-12">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border-2 border-[#2f2a22] rounded-full" />
                  {/* Inner ring */}
                  <div className="absolute inset-4 border border-[#2f2a22]/30 rounded-full" />
                  {/* Dashed ring */}
                  <div className="absolute inset-8 border border-dashed border-[#2f2a22]/20 rounded-full" />
                  {/* Center content */}
                  <div className="text-center space-y-1 z-10 px-8">
                    <div className="font-label text-[8px] uppercase tracking-[0.3em] text-[#2f2a22]/40 block">Certified by</div>
                    <div className="font-headline text-sm font-semibold uppercase tracking-tighter leading-tight">Limited<br />Exposure</div>
                    <div className="font-label text-[8px] uppercase tracking-[0.25em] text-[#2f2a22]/40 block mt-2">Original Print</div>
                    {/* Small checkmark */}
                    <div className="flex justify-center mt-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  {/* Decorative dots at compass points */}
                  {[0, 90, 180, 270].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-1.5 h-1.5 bg-[#2f2a22] rounded-full"
                      style={{
                        top: `calc(50% - 3px + ${Math.cos((deg * Math.PI) / 180) * -124}px)`,
                        left: `calc(50% - 3px + ${Math.sin((deg * Math.PI) / 180) * 124}px)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Přihláška ──────────────────────────────────── */}
        <section id="prihlaska" className="py-24 md:py-32 bg-mocha text-[#f7f3ec]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#f7f3ec]/30 block">Přihláška</span>
              <h2 className="font-headline text-4xl md:text-5xl font-semibold tracking-tighter">
                Staňte se součástí výběru.
              </h2>
              <p className="font-body text-base text-[#f7f3ec]/50 leading-relaxed">
                Zašlete nám link na vaše portfolio. Komise provede posouzení do 14 dní a zašle individuální zpětnou vazbu — bez ohledu na výsledek výběru.
              </p>
              <a
                href="mailto:hello@otisk.cz?subject=Přihláška fotografa — Otisk&body=Ahoj,%0A%0APosílám přihlášku k zařazení na platformu Otisk.%0A%0APortfolio / web:%0AInstagram:%0AO mé tvorbě (pár vět):%0A%0ADěkuji."
                className="inline-block border border-[#fdfbf6]/30 text-[#f7f3ec] px-12 py-6 font-label text-xs uppercase tracking-widest hover:bg-[#fdfbf6] hover:text-[#2f2a22] transition-colors"
              >
                Odeslat přihlášku →
              </a>
              <p className="font-label text-[10px] uppercase tracking-widest text-[#f7f3ec]/20">
                hello@otisk.cz · Odpovídáme do 14 dní
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
