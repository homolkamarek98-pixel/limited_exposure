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
        <section className="px-6 md:px-12 pt-16 md:pt-28 pb-16 md:pb-28">
          <div className="max-w-screen-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-12">
              Otisk · Artist Hub
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.92] text-[#1a1714] max-w-4xl mb-12">
              Vaše tvorba si zaslouží víc než jen lajky.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#e7dfd2] pt-12">
              <div className="md:col-span-5">
                <p className="text-xl md:text-2xl leading-relaxed text-[#1a1714]">
                  Fotografie je v Česku nedoceněná. My to měníme — vracíme jí hmotnou podstatu, limitaci a sběratelskou úctu.
                </p>
              </div>
              <div className="md:col-span-5 md:col-start-8 flex flex-col justify-between gap-8">
                <p className="text-base leading-relaxed text-[#57503f]">
                  Otisk není obchod s obrázky. Je to standard — kurátorský a výrobní proces, který zaručuje, že každý tisk z naší platformy je originál s doložitelnou hodnotou.
                </p>
                <div>
                  <Link
                    href="#prihlaska"
                    className="inline-block bg-[#1a1714] text-[#faf6f0] px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
                  >
                    Staňte se součástí výběru →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ───────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-4">Pro autory</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#1a1714]">Co z toho máte.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#e7dfd2]">
              {benefits.map(({ number, title, body }, i) => (
                <div
                  key={number}
                  className={["p-8 md:p-10 space-y-5", i < 2 ? "border-b md:border-b-0 md:border-r border-[#e7dfd2]" : ""].join(" ")}
                >
                  <div className="otisk-mono text-5xl font-medium text-[#c4bba9] leading-none">{number}</div>
                  <h3 className="text-xl font-medium tracking-[-0.01em] text-[#1a1714]">{title}</h3>
                  <p className="text-sm text-[#57503f] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Manifest ───────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-8">Proč to děláme</span>
              <p className="text-2xl md:text-3xl font-medium tracking-[-0.02em] leading-[1.3] text-[#1a1714] mb-6">
                „Fotografie je v Česku nedoceněná. Ne proto, že lidé nemají vkus — ale proto, že trh nenabídl správný rámec.“
              </p>
              <p className="text-base leading-relaxed text-[#57503f] max-w-2xl">
                Otisk ten rámec vytváří. Každá edice je limitovaná. Každý tisk je certifikovaný. Každý autor je prověřený. Nejde o obchod — jde o standard, který české fotografii dlouho chyběl.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cesta díla ─────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-4">Proces</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#1a1714]">Cesta díla — od vás ke sběrateli.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-[#e7dfd2]">
              {journey.map(({ step, label, desc }, i) => (
                <div
                  key={step}
                  className={[
                    "p-6 space-y-3",
                    i < journey.length - 1 ? "border-b md:border-b-0 md:border-r border-[#e7dfd2]" : "",
                    "md:last:border-r-0",
                  ].join(" ")}
                >
                  <div className="w-8 h-8 bg-[#1a1714] text-[#faf6f0] flex items-center justify-center">
                    <span className="otisk-mono text-[10px]">{step}</span>
                  </div>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#1a1714]">{label}</h3>
                  <p className="text-xs text-[#57503f] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Badge / Certified seal ──────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Certifikovaný autor</span>
                <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714]">
                  Pečeť, která říká víc než bio na Instagramu.
                </h2>
                <p className="text-base text-[#57503f] leading-relaxed max-w-md">
                  Každý autor na Otisk získává digitální badge „Certified by Otisk“. Sdílejte ji na svém webu, portfoliu nebo Instagramu — jako doklad, že vaše tvorba prošla profesionálním výběrem.
                </p>
                <Link
                  href="#prihlaska"
                  className="inline-block bg-[#1a1714] text-[#faf6f0] px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
                >
                  Staňte se součástí výběru →
                </Link>
              </div>

              {/* Badge visual */}
              <div className="flex items-center justify-center py-12">
                <div className="relative w-64 h-64 flex items-center justify-center text-[#1a1714]">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border border-[#1a1714] rounded-full" />
                  {/* Inner ring */}
                  <div className="absolute inset-4 border border-[#1a1714]/30 rounded-full" />
                  {/* Dashed ring */}
                  <div className="absolute inset-8 border border-dashed border-[#1a1714]/20 rounded-full" />
                  {/* Center content */}
                  <div className="text-center space-y-1 z-10 px-8">
                    <div className="text-[8px] uppercase tracking-[0.3em] text-[#8a8170] block">Certified by</div>
                    <div className="text-sm font-medium uppercase tracking-[0.1em] leading-tight">Otisk</div>
                    <div className="text-[8px] uppercase tracking-[0.25em] text-[#8a8170] block mt-2">Original Print</div>
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
                      className="absolute w-1.5 h-1.5 bg-[#1a1714] rounded-full"
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
        <section id="prihlaska" className="border-t border-[#e7dfd2] py-20 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Přihláška</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#1a1714]">
                Staňte se součástí výběru.
              </h2>
              <p className="text-base text-[#57503f] leading-relaxed">
                Zašlete nám link na vaše portfolio. Komise provede posouzení do 14 dní a zašle individuální zpětnou vazbu — bez ohledu na výsledek výběru.
              </p>
              <a
                href="mailto:hello@otisk.gallery?subject=Přihláška fotografa — Otisk&body=Ahoj,%0A%0APosílám přihlášku k zařazení na platformu Otisk.%0A%0APortfolio / web:%0AInstagram:%0AO mé tvorbě (pár vět):%0A%0ADěkuji."
                className="inline-block bg-[#1a1714] text-[#faf6f0] px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
              >
                Odeslat přihlášku →
              </a>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c4bba9]">
                hello@otisk.gallery · Odpovídáme do 14 dní
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
