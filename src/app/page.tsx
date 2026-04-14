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

  return (
    <>
      <Nav active="gallery" />
      <main>

        {/* ── Hero — full bleed, text přímo na fotce ─────── */}
        <section className="relative w-full h-[90svh] min-h-[560px] overflow-hidden">
          {/* Foto přes celou plochu */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/hero-gallery/1600/900"
              alt="Limited Exposure — featured work"
              className="w-full h-full object-cover grayscale"
            />
            {/* Gradient — bottom fade pro čitelnost textu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>

          {/* Text dole vlevo */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 md:pb-14">
            <div className="max-w-screen-2xl mx-auto">
              <span className="font-label text-[10px] uppercase tracking-[0.25em] text-white/50 block mb-4">
                Kurátorský výběr · Každý tisk číslován
              </span>
              <h1 className="serif-display text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] text-white mb-6 max-w-2xl">
                Limitované fotografie od současných autorů.
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/gallery"
                  className="bg-white text-black px-8 md:px-10 py-3.5 md:py-4 font-label text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 transition-colors inline-block text-center"
                >
                  Vybrat dílo
                </Link>
                <Link
                  href="/about"
                  className="border border-white/30 text-white px-8 md:px-10 py-3.5 md:py-4 font-label text-[10px] uppercase tracking-[0.2em] hover:border-white/60 transition-colors inline-block text-center"
                >
                  Jak to funguje →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Value pillars bar ──────────────────────────── */}
        <section className="bg-[#1c1811] text-[#faf8f4]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {(["Kurátorský výběr", "Limitované edice", "Pojištěná doprava", "Certifikát pravosti"] as const).map((label, i) => (
                <div
                  key={label}
                  className={[
                    "text-center px-4 py-4",
                    i === 1 || i === 3 ? "border-l border-white/10" : "",
                    i >= 2 ? "border-t border-white/10" : "",
                    i >= 1 ? "md:border-l md:border-white/10" : "",
                    i >= 2 ? "md:border-t-0" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span className="font-label text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rising Talents — instagram feed grid ───────── */}
        <section id="gallery" className="py-16 md:py-24 bg-[#faf8f4]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            {/* Header */}
            <div className="flex justify-between items-baseline mb-10 md:mb-12">
              <div>
                <h2 className="serif-display text-2xl md:text-3xl font-bold">Rising Talents</h2>
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8a8070] mt-1">
                  Fotografové na vzestupu · omezené edice
                </p>
              </div>
              <Link
                href="/gallery"
                className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8a8070] hover:text-black transition-colors whitespace-nowrap"
              >
                Vše →
              </Link>
            </div>

            {risingTalents.length === 0 ? (
              <p className="font-body text-[#8a8070] text-center py-24">Žádné edice zatím nejsou k dispozici.</p>
            ) : (
              /* 2 sloupce na mobilu, 3 na desktopu — jako IG grid */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
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

            <div className="mt-14 text-center">
              <Link
                href="/gallery"
                className="inline-block border border-[#e0dcd4] text-[#1c1811] px-10 py-3.5 font-label text-[10px] uppercase tracking-[0.2em] hover:border-[#1c1811] transition-colors"
              >
                Zobrazit celou kolekci →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Signature Series spotlight ──────────────────── */}
        {signature && (
          <section className="bg-[#1c1811] text-[#faf8f4] overflow-hidden">
            <div className="max-w-screen-2xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Fotka — edge to edge */}
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[600px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signature.photo.imageUrl}
                    alt={signature.photo.title}
                    className="w-full h-full object-cover grayscale brightness-90"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="font-label text-[9px] uppercase tracking-[0.25em] text-white/50 bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
                      Signature Series
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14 md:py-16 space-y-8">
                  <div className="space-y-4">
                    <p className="font-label text-[9px] uppercase tracking-[0.25em] text-[#faf8f4]/40">
                      {signature.photo.photographer?.user?.name ?? "Fotograf"}
                    </p>
                    <h2 className="serif-display text-4xl md:text-5xl lg:text-6xl font-bold leading-none text-[#faf8f4]">
                      {signature.photo.title}
                    </h2>
                    <p className="font-body text-base text-[#faf8f4]/60 max-w-sm leading-relaxed">
                      Limitovaná edice. Po vyprodání nebo uplynutí doby edice nekoupíte znovu.
                    </p>
                  </div>

                  {signature.availableUntil && (
                    <div className="space-y-2 py-6 border-y border-white/10">
                      <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#faf8f4]/30">
                        Edice se uzavírá za:
                      </p>
                      <CountdownTimer deadline={new Date(signature.availableUntil)} />
                      <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#faf8f4]/20">
                        Po uzavření nebude edice znovu dostupná.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link
                      href={`/listing/${signature.id}`}
                      className="inline-block bg-[#faf8f4] text-[#1c1811] px-10 py-4 font-label text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors"
                    >
                      Získat do sbírky
                    </Link>
                    <p className="font-label text-[9px] uppercase tracking-[0.15em] text-[#faf8f4]/30 block">
                      Certifikát pravosti · Pojištěná doprava · Vlastnoruční podpis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── How it works — čistá 3-column mřížka ──────── */}
        <section className="py-20 md:py-28 bg-[#faf8f4]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex justify-between items-baseline mb-12">
              <h2 className="serif-display text-2xl md:text-3xl font-bold">Jak to funguje</h2>
              <span className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8a8070]">3 kroky</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e8e4dc]">
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
              ].map(({ step, title, body, cta, href }) => (
                <div
                  key={step}
                  className="bg-[#faf8f4] p-8 md:p-10 space-y-4"
                >
                  <div className="serif-display text-3xl font-black text-[#e0dcd4]">{step}</div>
                  <h3 className="font-label text-xs uppercase tracking-[0.15em] font-bold">{title}</h3>
                  <p className="font-body text-sm text-[#4a4539] leading-relaxed">{body}</p>
                  {cta && href && (
                    <Link href={href} className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8a8070] hover:text-black transition-colors inline-block border-b border-[#e0dcd4] pb-0.5">
                      {cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guarantees — minimální, teplé ──────────────── */}
        <section className="py-20 md:py-28 bg-[#f5f2ec]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e4dc]">
              {[
                {
                  title: "Certifikát pravosti",
                  body: "Certifikát s pořadovým číslem a podpisem fotografa.",
                },
                {
                  title: "Archivní kvalita",
                  body: "Tisk na Hahnemühle Photo Rag Baryta s archivní stálostí 100+ let.",
                },
                {
                  title: "Pojištěná doprava",
                  body: "Bezpečné archivní balení a pojištěná doprava ke dveřím.",
                },
                {
                  title: "Uzavřené edice",
                  body: "Edice mají pevně daný počet kusů. Po vyprodání nejsou znovu dostupné.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  className="bg-[#f5f2ec] p-8 space-y-3"
                >
                  <h3 className="font-label text-[10px] uppercase tracking-[0.2em] font-bold">{title}</h3>
                  <p className="font-body text-sm text-[#4a4539] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Unboxing moment ─────────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#1c1811] text-[#faf8f4] overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="space-y-6">
                <span className="font-label text-[9px] uppercase tracking-[0.25em] text-[#faf8f4]/30 block">
                  Fyzický zážitek
                </span>
                <h2 className="serif-display text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                  Tisk, který cítíte<br />ještě před pověšením.
                </h2>
                <p className="font-body text-base text-[#faf8f4]/50 max-w-md leading-relaxed">
                  Archivní papír 315 g/m², ochranná trubice, bavlněné rukavice a certifikát s vlastnoručním podpisem.
                </p>
                <div className="flex flex-col gap-2.5 pt-2">
                  {[
                    "Archivní balení v ochranné trubici",
                    "Bavlněné rukavice pro manipulaci s tiskem",
                    "Certifikát v ochranném plexisklovém pouzdře",
                    "Instrukce pro dlouhodobé uchovávání",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-px h-3 bg-[#faf8f4]/20 shrink-0" />
                      <span className="font-label text-[9px] uppercase tracking-[0.15em] text-[#faf8f4]/50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video placeholder */}
              <div className="relative aspect-video bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-white/40 group-hover:text-white/70 transition-colors">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
                    Video — brzy k dispozici
                  </span>
                </div>
                <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-white/10" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-white/10" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-white/10" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-white/10" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Newsletter ──────────────────────────────────── */}
        <section className="py-28 md:py-36 bg-[#faf8f4]">
          <div className="max-w-screen-sm mx-auto px-6 md:px-12 text-center space-y-8">
            <div className="space-y-3">
              <span className="font-label text-[9px] uppercase tracking-[0.25em] text-[#8a8070] block">Privátní přístup</span>
              <h3 className="serif-display text-3xl md:text-4xl font-bold">Získejte přednostní přístup</h3>
            </div>
            <p className="font-body text-[#4a4539] max-w-xs mx-auto leading-relaxed text-sm">
              Odběratelé mají přístup k novým edicím 24 hodin před zveřejněním.
            </p>
            <form className="relative max-w-sm mx-auto pt-4">
              <input
                type="email"
                placeholder="váš@email.cz"
                className="w-full bg-transparent border-0 border-b border-[#e0dcd4] py-4 px-0 font-body text-sm focus:ring-0 focus:border-[#1c1811] transition-all placeholder:text-[#c0b8a8] outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 font-label text-[9px] uppercase tracking-[0.2em] text-[#8a8070] hover:text-black transition-colors"
              >
                Odebírat →
              </button>
            </form>
            <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#c0b8a8]">
              Žádný spam. Odhlášení kdykoliv.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
