import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pro fotografy — Limited Exposure",
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
    body: "Archivní tisk na Hahnemühle Photo Rag Baryta, certifikát pravosti s vaším podpisem, pojištěná doprava až ke sběrateli. Každý prodej na Limited Exposure je záznamem ve vaší profesionální historii.",
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
        <section className="bg-black text-white px-6 md:px-12 pt-24 md:pt-36 pb-24 md:pb-32">
          <div className="max-w-screen-2xl mx-auto">
            <span className="font-label text-[10px] uppercase tracking-widest text-white/30 block mb-12">
              Limited Exposure · Artist Hub
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] max-w-4xl mb-12">
              Vaše tvorba si zaslouží víc než jen lajky.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/10 pt-12">
              <div className="md:col-span-5">
                <p className="font-body text-xl md:text-2xl leading-relaxed text-white/80">
                  Fotografie je v Česku nedoceněná. My to měníme — vracíme jí hmotnou podstatu, limitaci a sběratelskou úctu.
                </p>
              </div>
              <div className="md:col-span-5 md:col-start-8 flex flex-col justify-between gap-8">
                <p className="font-body text-base leading-relaxed text-white/50">
                  Limited Exposure není obchod s obrázky. Je to standard — kurátorský a výrobní proces, který zaručuje, že každý tisk z naší platformy je originál s doložitelnou hodnotou.
                </p>
                <div>
                  <Link
                    href="#prihlaska"
                    className="inline-block border border-white/30 text-white px-10 py-5 font-label text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Staňte se součástí výběru →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ───────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-[#f9f9f9]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#777] block mb-4">Pro autory</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter">Co z toho máte.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#e8e8e8]">
              {benefits.map(({ number, title, body }, i) => (
                <div
                  key={number}
                  className={["p-8 md:p-10 space-y-5 bg-white", i < 2 ? "border-b md:border-b-0 md:border-r border-[#e8e8e8]" : ""].join(" ")}
                >
                  <div className="font-headline text-5xl font-black text-[#f0f0f0] leading-none">{number}</div>
                  <h3 className="font-headline text-xl font-black tracking-tight">{title}</h3>
                  <p className="font-body text-sm text-[#474747] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Manifest ───────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-black text-white">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <span className="font-label text-[10px] uppercase tracking-widest text-white/30 block mb-8">Proč to děláme</span>
              <p className="font-body text-2xl md:text-3xl leading-relaxed text-white/90 mb-6">
                „Fotografie je v Česku nedoceněná. Ne proto, že lidé nemají vkus — ale proto, že trh nenabídl správný rámec."
              </p>
              <p className="font-body text-base leading-relaxed text-white/50 max-w-2xl">
                Limited Exposure ten rámec vytváří. Každá edice je limitovaná. Každý tisk je certifikovaný. Každý autor je prověřený. Nejde o obchod — jde o standard, který české fotografii dlouho chyběl.
              </p>
            </div>
          </div>
        </section>

        {/* ── Cesta díla ─────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <span className="font-label text-[10px] uppercase tracking-widest text-[#777] block mb-4">Proces</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter">Cesta díla — od vás ke sběrateli.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-[#e8e8e8]">
              {journey.map(({ step, label, desc }, i) => (
                <div
                  key={step}
                  className={[
                    "p-6 space-y-3",
                    i < journey.length - 1 ? "border-b md:border-b-0 md:border-r border-[#e8e8e8]" : "",
                    /* mobile: only right border for odd items */
                    "md:last:border-r-0",
                  ].join(" ")}
                >
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                    <span className="font-label text-[10px] font-black">{step}</span>
                  </div>
                  <h3 className="font-headline text-sm font-black uppercase tracking-tight">{label}</h3>
                  <p className="font-body text-xs text-[#777] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Badge / Certified seal ──────────────────────── */}
        <section className="py-24 md:py-32 bg-[#f9f9f9]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="font-label text-[10px] uppercase tracking-widest text-[#777] block">Certifikovaný autor</span>
                <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                  Pečeť, která říká víc než bio na Instagramu.
                </h2>
                <p className="font-body text-base text-[#474747] leading-relaxed max-w-md">
                  Každý autor na Limited Exposure získává digitální badge „Certified by Limited Exposure". Sdílejte ji na svém webu, portfoliu nebo Instagramu — jako doklad, že vaše tvorba prošla profesionálním výběrem.
                </p>
                <Link
                  href="#prihlaska"
                  className="inline-block bg-black text-white px-10 py-5 font-label text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  Staňte se součástí výběru →
                </Link>
              </div>

              {/* Badge visual */}
              <div className="flex items-center justify-center py-12">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border-2 border-black rounded-full" />
                  {/* Inner ring */}
                  <div className="absolute inset-4 border border-black/30 rounded-full" />
                  {/* Dashed ring */}
                  <div className="absolute inset-8 border border-dashed border-black/20 rounded-full" />
                  {/* Center content */}
                  <div className="text-center space-y-1 z-10 px-8">
                    <div className="font-label text-[8px] uppercase tracking-[0.3em] text-black/40 block">Certified by</div>
                    <div className="font-headline text-sm font-black uppercase tracking-tighter leading-tight">Limited<br />Exposure</div>
                    <div className="font-label text-[8px] uppercase tracking-[0.25em] text-black/40 block mt-2">Original Print</div>
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
                      className="absolute w-1.5 h-1.5 bg-black rounded-full"
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
        <section id="prihlaska" className="py-24 md:py-32 bg-black text-white">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <span className="font-label text-[10px] uppercase tracking-widest text-white/30 block">Přihláška</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter">
                Staňte se součástí výběru.
              </h2>
              <p className="font-body text-base text-white/50 leading-relaxed">
                Zašlete nám link na vaše portfolio. Komise provede posouzení do 14 dní a zašle individuální zpětnou vazbu — bez ohledu na výsledek výběru.
              </p>
              <a
                href="mailto:hello@limitedexposure.cz?subject=Přihláška fotografa — Limited Exposure&body=Ahoj,%0A%0APosílám přihlášku k zařazení na platformu Limited Exposure.%0A%0APortfolio / web:%0AInstagram:%0AO mé tvorbě (pár vět):%0A%0ADěkuji."
                className="inline-block border border-white/30 text-white px-12 py-6 font-label text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Odeslat přihlášku →
              </a>
              <p className="font-label text-[10px] uppercase tracking-widest text-white/20">
                hello@limitedexposure.cz · Odpovídáme do 14 dní
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
