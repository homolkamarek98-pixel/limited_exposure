import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import CountdownTimer from "@/components/CountdownTimer";
import { prisma } from "@/lib/prisma";

async function getData() {
  const [risingTalents, signatureList] = await Promise.all([
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
  ]);
  return { risingTalents, signature: signatureList[0] ?? null };
}

export default async function HomePage() {
  const { risingTalents, signature } = await getData();

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
            <div className="max-w-3xl space-y-6 le-glass p-8 md:p-12 inline-block">
              <span className="font-label text-xs uppercase tracking-[0.3em] text-primary">
                Nový přírůstek
              </span>
              <h1 className="serif-display text-6xl md:text-8xl font-black leading-[0.9] text-primary">
                Limited Exposure:<br />
                Kurátorské.<br />
                Vzácné. Pravé.
              </h1>
              <div className="pt-6">
                <Link
                  href="#gallery"
                  className="bg-primary text-on-primary px-10 md:px-12 py-4 md:py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors inline-block"
                >
                  Prozkoumat kolekci
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Mission ────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="serif-display text-3xl md:text-4xl font-bold text-primary">Naše mise</h2>
            </div>
            <div className="md:col-span-8">
              <p className="font-body text-xl md:text-2xl leading-relaxed text-on-surface font-light max-w-3xl">
                Stojíme na průsečíku tradiční správy umění a digitální hranice. Limited Exposure je inkubátor pro přesvědčivé fotografy, kde{" "}
                <strong className="font-bold">pravost je ověřena</strong> a{" "}
                <strong className="font-bold">vzácnost je absolutní.</strong>{" "}
                Každé dílo nese certifikát pravosti s pořadovým číslem.
              </p>
            </div>
          </div>
        </section>

        {/* ── Rising Talents ─────────────────────────────── */}
        <section id="gallery" className="py-24 md:py-32 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex justify-between items-end mb-16 md:mb-20">
              <div className="space-y-4">
                <span className="font-label text-xs uppercase tracking-widest text-secondary">Nové archivy</span>
                <h2 className="serif-display text-4xl md:text-5xl font-bold text-primary">Rising Talents</h2>
              </div>
              <Link
                href="/gallery"
                className="font-label text-xs uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity hidden md:block"
              >
                Zobrazit vše →
              </Link>
            </div>

            {risingTalents.length === 0 ? (
              <p className="font-body text-secondary text-center py-24">Žádné edice zatím nejsou k dispozici.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                {risingTalents.map((edition, i) => (
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
          </div>
        </section>

        {/* ── Signature Series spotlight ──────────────────── */}
        {signature && (
          <section className="py-24 md:py-32 bg-primary text-on-primary overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                {/* Image with certificate frame */}
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
                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="font-label text-xs uppercase tracking-[0.4em] text-on-primary-fixed-variant">
                      Signature Series
                    </span>
                    <h2 className="serif-display text-5xl md:text-7xl font-bold leading-none">
                      {signature.photo.title}
                    </h2>
                    <p className="font-body text-lg text-on-primary/70 max-w-md">
                      {signature.photo.description}
                    </p>
                  </div>

                  {signature.availableUntil && (
                    <div className="space-y-3">
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-primary/50">
                        Edice vyprší za:
                      </p>
                      <CountdownTimer deadline={new Date(signature.availableUntil)} />
                    </div>
                  )}

                  <Link
                    href={`/listing/${signature.id}`}
                    className="inline-block w-full md:w-auto text-center bg-on-primary text-primary px-12 md:px-16 py-5 md:py-6 font-label text-xs uppercase tracking-widest font-bold hover:bg-surface-dim transition-colors"
                  >
                    Vstoupit do privátního prodeje
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Newsletter ──────────────────────────────────── */}
        <section className="py-32 md:py-40 bg-surface">
          <div className="max-w-screen-md mx-auto px-6 md:px-12 text-center space-y-10">
            <h3 className="serif-display text-3xl md:text-4xl font-bold">Přístup do archivu</h3>
            <p className="font-body text-on-surface-variant">
              Připojte se k privátnímu mailingovému listu pro dřívější přístup k edičním dropům a exkluzivní rozhovory s fotografy.
            </p>
            <form className="relative max-w-md mx-auto">
              <input
                type="email"
                placeholder="VÁŠ@EMAIL.CZ"
                className="w-full bg-transparent border-0 border-b border-outline py-4 px-0 font-label text-xs tracking-widest focus:ring-0 focus:border-primary transition-all uppercase placeholder:text-outline outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 font-label text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                Odebírat →
              </button>
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
