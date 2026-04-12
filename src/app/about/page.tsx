import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Nav active="about" />
      <main className="max-w-screen-2xl mx-auto">

        {/* Hero */}
        <section className="px-6 md:px-12 pt-16 md:pt-24 pb-24 md:pb-32 border-b border-outline-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="font-label text-xs uppercase tracking-widest text-secondary block mb-8">O platformě</span>
            </div>
            <div className="md:col-span-8">
              <h1 className="serif-display text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-12">
                Průsečík tradiční správy umění a digitální hranice.
              </h1>
              <p className="font-body text-xl md:text-2xl leading-relaxed text-on-surface-variant max-w-2xl">
                Limited Exposure vznikl z přesvědčení, že fotografie jako médium si zaslouží stejnou péči, jaká se věnuje tisku uměleckých knih. Každé dílo je kurátorsky vybrané, každá edice je přísně limitovaná.
              </p>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="px-6 md:px-12 py-24 md:py-32 bg-surface-container-low">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="serif-display text-sm font-black uppercase tracking-widest border-b border-primary pb-4 mb-8">
                Manifest
              </h2>
            </div>
            <div className="md:col-span-7 space-y-8">
              {[
                {
                  num: "01",
                  title: "Pravost je absolutní",
                  body: "Každý tisk nese certifikát s pořadovým číslem, vlastnoručním podpisem fotografa a QR kódem ověřitelným v našem archivu. Duplikáty neexistují.",
                },
                {
                  num: "02",
                  title: "Vzácnost je záměrná",
                  body: "Limitujeme počet výtisků nebo dobu dostupnosti — nikdy obojí najednou. Jakmile edice vyprší, není nikdy znovu otevřena.",
                },
                {
                  num: "03",
                  title: "Kurátoři rozhodují",
                  body: "Na platformě není každý. Fotografové procházejí výběrovým procesem. Kritéria: vizuální konzistence, technické zpracování, příběh.",
                },
                {
                  num: "04",
                  title: "Tisk je médium",
                  body: "Tiskneme výhradně na Hahnemühle Photo Rag Baryta s archivními inkousty. Stálost 100+ let. Správa barev provedena fotografem, ne automatem.",
                },
              ].map(({ num, title, body }) => (
                <div key={num} className="flex gap-8 pt-8 border-t border-outline-variant/20 first:border-t-0 first:pt-0">
                  <span className="font-label text-xs text-outline shrink-0 w-8">{num}</span>
                  <div className="space-y-3">
                    <h3 className="font-body font-bold text-lg">{title}</h3>
                    <p className="font-body text-base text-on-surface-variant leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="px-6 md:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="serif-display text-sm font-black uppercase tracking-widest border-b border-primary pb-4 mb-8">
                Jak to funguje
              </h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", label: "Výběr díla", desc: "Projděte kurátorský výběr. Filtrujte podle tier, ceny, dostupnosti." },
                { step: "2", label: "Nákup edice", desc: "Zabezpečená platba kartou. Okamžité potvrzení a rezervace pořadového čísla." },
                { step: "3", label: "Tisk a doručení", desc: "Tisk na Hahnemühle, archivní balení, pojištěná světová doprava." },
              ].map(({ step, label, desc }) => (
                <div key={step} className="p-8 bg-surface-container-low border border-outline-variant/20">
                  <div className="serif-display text-5xl font-black text-outline/30 mb-6">{step}</div>
                  <h3 className="font-body font-bold mb-3">{label}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-6 md:mx-12 mb-24 bg-primary text-on-primary p-12 md:p-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h3 className="serif-display text-2xl md:text-4xl font-bold leading-tight">
              Začněte svou kolekci.
            </h3>
            <Link
              href="/gallery"
              className="inline-block bg-on-primary text-primary px-10 md:px-16 py-5 font-label text-xs uppercase tracking-widest font-bold hover:bg-surface-dim transition-colors whitespace-nowrap"
            >
              Prozkoumat galerii →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
