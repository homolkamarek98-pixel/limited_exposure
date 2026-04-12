import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import CountdownTimer from "@/components/CountdownTimer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getData() {
  const [risingTalents, signatureList, stats] = await Promise.all([
    prisma.edition.findMany({
      where: { tier: "RISING_TALENT" },
      include: { photo: { include: { photographer: { include: { user: { select: { id: true, name: true } } } } } } },
      orderBy: { photo: { photographer: { totalSales: "desc" } } },
      take: 3,
    }),
    prisma.edition.findMany({
      where: { tier: "SIGNATURE" },
      include: { photo: { include: { photographer: { include: { user: { select: { id: true, name: true } } } } } } },
      orderBy: { photo: { photographer: { totalSales: "desc" } } },
      take: 1,
    }),
    Promise.all([
      prisma.photographer.aggregate({ _sum: { totalSales: true } }),
      prisma.edition.count(),
      prisma.photographer.count(),
    ]),
  ]);

  const [salesAgg, editionCount, photographerCount] = stats;

  return {
    risingTalents,
    signature: signatureList[0] ?? null,
    totalSales: salesAgg._sum.totalSales ?? 0,
    editionCount,
    photographerCount,
  };
}

export default async function HomePage() {
  const { risingTalents, signature, totalSales, editionCount, photographerCount } = await getData();

  return (
    <>
      <Nav active="gallery" />
      <main>

        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative w-full min-h-screen bg-surface flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 px-6 md:px-12 py-16">
            <div className="w-full h-full bg-surface-container-highest overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/hero-gallery/1600/900"
                alt="Limited Exposure — featured work"
                className="w-full h-full object-cover grayscale brightness-90 transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </div>
          <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl space-y-8 le-glass p-8 md:p-12 inline-block">
              <span className="font-label text-xs uppercase tracking-[0.3em] text-secondary">
                Kurátorský výběr · Každý tisk číslován
              </span>
              <h1 className="serif-display text-5xl md:text-7xl font-black leading-[0.95] text-primary">
                Fotografie v limitovaných edicích.
              </h1>
              <p className="font-body text-base md:text-lg text-on-surface/80 max-w-md leading-relaxed">
                Originální fotografické tisky v limitovaných edicích.<br />
                Každý tisk je číslovaný, podepsaný a opatřen certifikátem pravosti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/gallery"
                  className="bg-primary text-on-primary px-10 md:px-12 py-4 md:py-5 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity inline-block text-center"
                >
                  Vybrat dílo
                </Link>
                <Link
                  href="/about"
                  className="border border-outline/40 text-primary px-10 md:px-12 py-4 md:py-5 font-label text-xs uppercase tracking-widest hover:border-primary transition-colors inline-block text-center"
                >
                  Jak to funguje →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof bar ───────────────────────────── */}
        <section className="bg-primary text-on-primary py-6">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-0 divide-x divide-on-primary/20">
              {[
                { value: `${totalSales}+`, label: "Prodané tisky" },
                { value: photographerCount.toString(), label: "Vybraní fotografové" },
                { value: editionCount.toString(), label: "Aktivní edice" },
                { value: "100%", label: "Certifikované tisky" },
              ].map(({ value, label }) => (
                <div key={label} className="flex-1 text-center px-6 min-w-[140px]">
                  <div className="serif-display text-3xl md:text-4xl font-black">{value}</div>
                  <div className="font-label text-[10px] uppercase tracking-widest text-on-primary/60 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rising Talents ─────────────────────────────── */}
        <section id="gallery" className="py-24 md:py-32 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16 md:mb-20">
              <div className="space-y-4">
                <span className="font-label text-xs uppercase tracking-widest text-secondary">Nová díla v kolekci</span>
                <h2 className="serif-display text-4xl md:text-5xl font-bold text-primary">Rising Talents</h2>
                <p className="font-body text-base text-on-surface-variant max-w-md">
                  Fotografové na vzestupu.<br />
                  Edice mají pevně stanovený počet kusů. Po vyprodání se znovu neotevírají.
                </p>
              </div>
              <Link
                href="/gallery"
                className="font-label text-xs uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity self-start md:self-auto whitespace-nowrap"
              >
                Zobrazit kolekci →
              </Link>
            </div>

            {risingTalents.length === 0 ? (
              <p className="font-body text-secondary text-center py-24">Žádné edice zatím nejsou k dispozici.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                {risingTalents.map((edition) => (
                  <PhotoCard
                    key={edition.id}
                    id={edition.id}
                    title={edition.photo.title}
                    photographerName={edition.photo.photographer.user.name ?? "Neznámý fotograf"}
                    photographerId={edition.photo.photographer.id}
                    imageUrl={edition.photo.imageUrl}
                    price={edition.price}
                    editionType={edition.type}
                    totalCount={edition.totalCount}
                    soldCount={edition.soldCount}
                    availableUntil={edition.availableUntil}
                  />
                ))}
              </div>
            )}

            <div className="mt-16 text-center">
              <Link
                href="/gallery"
                className="inline-block border border-outline/30 text-primary px-12 py-4 font-label text-xs uppercase tracking-widest hover:border-primary hover:bg-surface-container transition-colors"
              >
                Zobrazit celou kolekci →
              </Link>
            </div>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────── */}
        <section className="py-24 md:py-32 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
              <div className="md:col-span-4">
                <h2 className="serif-display text-3xl md:text-4xl font-bold">Jak to funguje</h2>
              </div>
              <div className="md:col-span-8">
                <p className="font-body text-lg text-on-surface-variant leading-relaxed">
                  Od výběru díla po doručení — proces je jednoduchý a přehledný.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-outline-variant/20">
              {[
                {
                  step: "01",
                  title: "Vyberte dílo",
                  body: "Procházejte kurátorský výběr fotografií.\nKaždé dílo je dostupné v omezené edici nebo po omezenou dobu.",
                  cta: "Do galerie",
                  href: "/gallery",
                },
                {
                  step: "02",
                  title: "Zajistěte tisk",
                  body: "Platba probíhá bezpečně online.\nVaše pořadové číslo je rezervováno okamžitě.",
                  cta: null,
                  href: null,
                },
                {
                  step: "03",
                  title: "Doručení",
                  body: "Tisk na papír Hahnemühle Photo Rag Baryta.\nArchivní balení a pojištěná doprava.\nCertifikát pravosti je součástí.",
                  cta: null,
                  href: null,
                },
              ].map(({ step, title, body, cta, href }, i) => (
                <div
                  key={step}
                  className={[
                    "p-8 md:p-10 space-y-4",
                    i < 2 ? "border-b md:border-b-0 md:border-r border-outline-variant/20" : "",
                  ].join(" ")}
                >
                  <div className="serif-display text-4xl font-black text-outline/20">{step}</div>
                  <h3 className="font-body font-bold text-lg">{title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{body}</p>
                  {cta && href && (
                    <Link href={href} className="font-label text-xs uppercase tracking-widest border-b border-primary pb-0.5 hover:opacity-60 transition-opacity inline-block">
                      {cta} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Signature Series spotlight ──────────────────── */}
        {signature && (
          <section className="py-24 md:py-32 bg-primary text-on-primary overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                {/* Image */}
                <div className="relative group">
                  <div className="absolute -top-4 -left-4 w-full h-full border border-outline-variant/30 z-0" />
                  <div className="relative z-10 bg-white p-4 overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={signature.photo.imageUrl}
                        alt={signature.photo.title}
                        className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none overflow-hidden">
                      <span className="serif-display text-[100px] font-black uppercase tracking-tighter text-black whitespace-nowrap">
                        LIMITED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="font-label text-xs uppercase tracking-[0.4em] text-on-primary/50">
                      Signature Series
                    </span>
                    <h2 className="serif-display text-5xl md:text-7xl font-bold leading-none">
                      {signature.photo.title}
                    </h2>
                    <p className="font-body text-lg text-on-primary/70 max-w-md leading-relaxed">
                      Kurátorský výběr děl {signature.photo.photographer?.user?.name ?? "fotografa"}.<br />
                      Limitovaná edice s vlastnoručním podpisem fotografa.
                    </p>
                  </div>

                  {signature.availableUntil && (
                    <div className="space-y-3 py-6 border-y border-on-primary/20">
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-primary/50">
                        Edice se uzavírá za:
                      </p>
                      <CountdownTimer deadline={new Date(signature.availableUntil)} />
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-primary/40">
                        Po uzavření nebude edice znovu dostupná.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Link
                      href={`/listing/${signature.id}`}
                      className="inline-block w-full md:w-auto text-center bg-on-primary text-primary px-12 md:px-16 py-5 md:py-6 font-label text-xs uppercase tracking-widest font-bold hover:bg-surface-dim transition-colors"
                    >
                      Koupit tisk
                    </Link>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-primary/40 block">
                      Certifikát pravosti · Pojištěná doprava · Vlastnoruční podpis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Guarantees ─────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="serif-display text-3xl md:text-4xl font-bold mb-4">Proč nakupovat u nás</h2>
              <p className="font-body text-on-surface-variant max-w-md mx-auto">
                Každý detail procesu je navržen tak, aby váš nákup byl bezpečný.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-outline-variant/20">
              {[
                {
                  title: "Certifikát pravosti",
                  body: "Certifikát s pořadovým číslem a podpisem fotografa.",
                },
                {
                  title: "Archivní kvalita",
                  body: "Tisk na Hahnemühle Photo Rag Baryta s archivní stálostí.",
                },
                {
                  title: "Doprava",
                  body: "Bezpečné balení a pojištěná doprava.",
                },
                {
                  title: "Uzavřené edice",
                  body: "Edice mají pevně daný počet kusů. Po vyprodání nejsou znovu dostupné.",
                },
              ].map(({ title, body }, i) => (
                <div
                  key={title}
                  className={[
                    "p-8 space-y-3 bg-surface",
                    i < 3 ? "border-b lg:border-b-0 lg:border-r border-outline-variant/20" : "",
                  ].join(" ")}
                >
                  <h3 className="font-body font-bold">{title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ──────────────────────────────────── */}
        <section className="py-32 md:py-40 bg-surface">
          <div className="max-w-screen-md mx-auto px-6 md:px-12 text-center space-y-8">
            <div className="space-y-4">
              <span className="font-label text-xs uppercase tracking-widest text-secondary block">Privátní přístup</span>
              <h3 className="serif-display text-3xl md:text-4xl font-bold">Získejte přednostní přístup</h3>
            </div>
            <p className="font-body text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Odběratelé mají přístup k novým edicím 24 hodin před zveřejněním.
            </p>
            <form className="relative max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="VÁŠ@EMAIL.CZ"
                className="w-full bg-transparent border-0 border-b border-outline py-4 px-0 font-label text-xs tracking-widest focus:ring-0 focus:border-primary transition-all uppercase placeholder:text-outline outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 font-label text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                Získat přístup →
              </button>
            </form>
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">
              Žádný spam. Odhlášení kdykoliv.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
