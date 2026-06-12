import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import CountdownTimer from "@/components/CountdownTimer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getData() {
  const [risingTalents, signatureList] = await Promise.all([
    prisma.edition.findMany({
      where: { tier: "RISING_TALENT" },
      include: { photo: { include: { photographer: { include: { user: { select: { id: true, name: true } } } } } } },
      orderBy: { photo: { photographer: { totalSales: "desc" } } },
      take: 6,
    }),
    prisma.edition.findMany({
      where: { tier: "SIGNATURE" },
      include: { photo: { include: { photographer: { include: { user: { select: { id: true, name: true } } } } } } },
      orderBy: { photo: { photographer: { totalSales: "desc" } } },
      take: 1,
    }),
  ]);

  return {
    risingTalents,
    signature: signatureList[0] ?? null,
  };
}

export default async function HomePage() {
  const { risingTalents, signature } = await getData();
  const heroImage = signature?.photo.imageUrl ?? risingTalents[0]?.photo.imageUrl ?? "https://picsum.photos/seed/hero-gallery/1600/900";

  return (
    <>
      <Nav active="gallery" />
      <main>

        {/* ── Hero — typografický, na papíru ──────────────── */}
        <section className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-12 md:pb-20">
          <p className="otisk-rise otisk-rise-1 text-[10px] uppercase tracking-[0.3em] text-[#8a8170] mb-8">
            Kurátorský výběr · Každý tisk číslován a podepsán
          </p>
          <h1 className="otisk-rise otisk-rise-2 text-[13vw] md:text-8xl lg:text-[7.5rem] font-medium tracking-[-0.04em] leading-[0.92] text-[#1a1714] max-w-5xl">
            Limitované fotografické tisky.
          </h1>
          <div className="otisk-rise otisk-rise-3 mt-10 md:mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <p className="text-base md:text-lg text-[#57503f] leading-relaxed max-w-md">
              Každé dílo vychází v pevně dané edici. Po vyprodání ho nekoupíte znovu — váš otisk zůstane jediný svého čísla.
            </p>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/gallery"
                className="bg-[#1a1714] text-[#faf6f0] px-8 md:px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors text-center"
              >
                Vybrat dílo
              </Link>
              <Link
                href="/about"
                className="border border-[#e7dfd2] text-[#1a1714] px-8 md:px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:border-[#1a1714] transition-colors text-center"
              >
                Jak to funguje
              </Link>
            </div>
          </div>
        </section>

        {/* ── Hero foto — plnobarevné, široké ─────────────── */}
        <section className="otisk-rise otisk-rise-4 max-w-screen-2xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#f3ede3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="Otisk — aktuální dílo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center pt-3 border-b border-[#e7dfd2] pb-3">
            <span className="otisk-mono text-[10px] uppercase text-[#8a8170]">
              {signature ? `${signature.photo.title} — ${signature.photo.photographer?.user?.name ?? ""}` : "Z aktuální kolekce"}
            </span>
            <span className="otisk-mono text-[10px] uppercase text-[#c4bba9]">01</span>
          </div>
        </section>

        {/* ── Value pillars — hairline řádek ──────────────── */}
        <section className="border-y border-[#e7dfd2]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {(["Kurátorský výběr", "Limitované edice", "Pojištěná doprava", "Certifikát pravosti"] as const).map((label, i) => (
                <div
                  key={label}
                  className={[
                    "text-center px-4 py-5",
                    i % 2 === 1 ? "border-l border-[#e7dfd2]" : "",
                    i >= 2 ? "border-t border-[#e7dfd2] md:border-t-0" : "",
                    i >= 1 ? "md:border-l md:border-[#e7dfd2]" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rising Talents — grid ───────────────────────── */}
        <section id="gallery" className="py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            {/* Header */}
            <div className="flex justify-between items-baseline mb-10 md:mb-14">
              <div>
                <h2 className="text-2xl md:text-4xl font-medium tracking-[-0.02em]">Rising Talents</h2>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] mt-2">
                  Fotografové na vzestupu · omezené edice
                </p>
              </div>
              <Link
                href="/gallery"
                className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors whitespace-nowrap"
              >
                Vše →
              </Link>
            </div>

            {risingTalents.length === 0 ? (
              <p className="text-[#8a8170] text-center py-24">Žádné edice zatím nejsou k dispozici.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-20">
                {risingTalents.map((edition, idx) => (
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
                    offset={idx % 3 === 1}
                  />
                ))}
              </div>
            )}

            <div className="mt-16 text-center">
              <Link
                href="/gallery"
                className="inline-block border border-[#e7dfd2] text-[#1a1714] px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:border-[#1a1714] transition-colors"
              >
                Zobrazit celou kolekci →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Signature Series spotlight — světlý ─────────── */}
        {signature && (
          <section className="border-y border-[#e7dfd2]">
            <div className="max-w-screen-2xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Fotka — edge to edge, plná barva */}
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[640px] overflow-hidden bg-[#f3ede3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signature.photo.imageUrl}
                    alt={signature.photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="otisk-mono text-[9px] uppercase tracking-[0.2em] bg-[#faf6f0]/90 backdrop-blur-sm px-2.5 py-1.5 text-[#1a1714]">
                      Signature Series
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-14 md:py-20 space-y-10 lg:border-l border-[#e7dfd2]">
                  <div className="space-y-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170]">
                      {signature.photo.photographer?.user?.name ?? "Fotograf"}
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.03em] leading-[0.95] text-[#1a1714]">
                      {signature.photo.title}
                    </h2>
                    <p className="text-base text-[#57503f] max-w-sm leading-relaxed">
                      Limitovaná edice. Po vyprodání nebo uplynutí doby edice nekoupíte znovu.
                    </p>
                  </div>

                  {signature.availableUntil && (
                    <div className="space-y-2 py-8 border-y border-[#e7dfd2]">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#8a8170]">
                        Edice se uzavírá za:
                      </p>
                      <CountdownTimer deadline={new Date(signature.availableUntil)} />
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#c4bba9]">
                        Po uzavření nebude edice znovu dostupná.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Link
                      href={`/listing/${signature.id}`}
                      className="inline-block bg-[#1a1714] text-[#faf6f0] px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
                    >
                      Získat do sbírky
                    </Link>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a8170] block">
                      Certifikát pravosti · Pojištěná doprava · Vlastnoruční podpis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Jak to funguje — 3 kroky, hairline mřížka ──── */}
        <section className="py-20 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex justify-between items-baseline mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-medium tracking-[-0.02em]">Jak to funguje</h2>
              <span className="otisk-mono text-[10px] uppercase text-[#8a8170]">3 kroky</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#e7dfd2]">
              {[
                {
                  step: "01",
                  title: "Vyberte dílo",
                  body: "Procházejte kurátorský výběr fotografií. Každé dílo je dostupné v omezené edici.",
                  cta: "Do galerie →",
                  href: "/gallery",
                },
                {
                  step: "02",
                  title: "Rezervujte si své číslo",
                  body: "Vaše číslo tisku je rezervováno okamžitě po potvrzené platbě. Číslo si volíte sami.",
                  cta: null,
                  href: null,
                },
                {
                  step: "03",
                  title: "Doručení",
                  body: "Hahnemühle Photo Rag Baryta, archivní balení, pojištěná doprava. Certifikát pravosti je součástí.",
                  cta: null,
                  href: null,
                },
              ].map(({ step, title, body, cta, href }, i) => (
                <div
                  key={step}
                  className={[
                    "py-10 md:py-12 md:px-10 space-y-5 border-b border-[#e7dfd2] md:border-b-0",
                    i > 0 ? "md:border-l md:border-[#e7dfd2]" : "md:pl-0",
                  ].join(" ")}
                >
                  <div className="otisk-mono text-sm text-[#c4bba9]">{step}</div>
                  <h3 className="text-base font-medium tracking-[-0.01em]">{title}</h3>
                  <p className="text-sm text-[#57503f] leading-relaxed">{body}</p>
                  {cta && href && (
                    <Link href={href} className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors inline-block border-b border-[#e7dfd2] pb-0.5">
                      {cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Záruky + fyzický zážitek ────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-20 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
              <div className="space-y-6 lg:sticky lg:top-32">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">
                  Fyzický zážitek
                </span>
                <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.05]">
                  Tisk, který cítíte ještě před pověšením.
                </h2>
                <p className="text-base text-[#57503f] max-w-md leading-relaxed">
                  Archivní papír 315 g/m², ochranná trubice, bavlněné rukavice a certifikát s vlastnoručním podpisem.
                </p>
              </div>

              <div className="divide-y divide-[#e7dfd2] border-y border-[#e7dfd2]">
                {[
                  {
                    title: "Certifikát pravosti",
                    body: "Certifikát s pořadovým číslem a podpisem fotografa, v ochranném pouzdře.",
                  },
                  {
                    title: "Archivní kvalita",
                    body: "Tisk na Hahnemühle Photo Rag Baryta s archivní stálostí 100+ let.",
                  },
                  {
                    title: "Pojištěná doprava",
                    body: "Bezpečné archivní balení v ochranné trubici a pojištěná doprava ke dveřím.",
                  },
                  {
                    title: "Uzavřené edice",
                    body: "Edice mají pevně daný počet kusů. Po vyprodání nejsou znovu dostupné.",
                  },
                ].map(({ title, body }, i) => (
                  <div key={title} className="py-7 flex gap-6 md:gap-10 items-baseline">
                    <span className="otisk-mono text-xs text-[#c4bba9] shrink-0 w-8">{String(i + 1).padStart(2, "0")}</span>
                    <div className="space-y-2">
                      <h3 className="text-base font-medium tracking-[-0.01em]">{title}</h3>
                      <p className="text-sm text-[#57503f] leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Newsletter ──────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-28 md:py-40">
          <div className="max-w-screen-sm mx-auto px-6 md:px-12 text-center space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Privátní přístup</span>
              <h3 className="text-3xl md:text-4xl font-medium tracking-[-0.02em]">Získejte přednostní přístup</h3>
            </div>
            <p className="text-[#57503f] max-w-xs mx-auto leading-relaxed text-sm">
              Odběratelé mají přístup k novým edicím 24 hodin před zveřejněním.
            </p>
            <form className="relative max-w-sm mx-auto pt-4">
              <input
                type="email"
                placeholder="váš@email.cz"
                className="w-full bg-transparent border-0 border-b border-[#e7dfd2] py-4 px-0 text-sm focus:ring-0 focus:border-[#1a1714] transition-all placeholder:text-[#c4bba9] outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 text-[10px] uppercase tracking-[0.2em] text-[#8a8170] hover:text-[#1a1714] transition-colors"
              >
                Odebírat →
              </button>
            </form>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#c4bba9]">
              Žádný spam. Odhlášení kdykoliv.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
