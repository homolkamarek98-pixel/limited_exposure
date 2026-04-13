import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import ListingSidebar from "@/components/ListingSidebar";
import PhotoLightbox from "@/components/PhotoLightbox";
import { prisma } from "@/lib/prisma";

async function getData(id: string) {
  const edition = await prisma.edition.findUnique({
    where: { id },
    include: {
      photo: {
        include: {
          photographer: {
            include: {
              user: { select: { id: true, name: true } },
              photos: {
                take: 4,
                include: { editions: { take: 1 } },
              },
            },
          },
        },
      },
    },
  });

  if (!edition) return null;

  // Filtrujeme aktuální foto mimo "Další práce"
  edition.photo.photographer.photos = edition.photo.photographer.photos.filter(
    (p) => p.id !== edition.photo.id
  );

  return edition;
}

type Props = { params: Promise<{ id: string }> };

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const edition = await getData(id);
  if (!edition) notFound();

  const { photo } = edition;
  const { photographer } = photo;
  const authorName = photographer.user.name ?? "Neznámý fotograf";
  const isSignature = edition.tier === "SIGNATURE";
  const soldOut =
    edition.type === "LIMITED_COUNT" &&
    edition.totalCount !== null &&
    edition.soldCount >= edition.totalCount;
  const expired =
    edition.type === "TIME_WINDOW" &&
    edition.availableUntil !== null &&
    edition.availableUntil < new Date();

  return (
    <>
      <Nav active="gallery" />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-12 md:pt-24 pb-32">

        {/* ── Product View — asymetrický grid 8/4 ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">

          {/* Fotografie (2/3) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <PhotoLightbox src={photo.imageUrl} alt={photo.title}>
              <div className="relative aspect-[4/5] bg-surface-container-highest p-4 md:p-10 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-8 right-8 flex items-center gap-2 le-glass px-4 py-2 border border-outline/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span className="font-label text-[10px] uppercase tracking-widest font-bold">Prohlédnout detail</span>
                </div>
              </div>
            </PhotoLightbox>

            {/* Format indicator */}
            <div className="outline outline-1 outline-outline-variant/20 p-1">
              <div className="aspect-[16/3] bg-surface-container-low flex items-center justify-center">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                  Tisk na Hahnemühle Photo Rag Baryta • {photo.format === "S" ? "30 × 40" : photo.format === "M" ? "50 × 70" : "70 × 100"} cm
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar — client component (interactive format selector + cart) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col gap-10">
            <ListingSidebar
              edition={{
                id: edition.id,
                price: edition.price,
                priceS: edition.priceS,
                priceL: edition.priceL,
                type: edition.type,
                totalCount: edition.totalCount,
                soldCount: edition.soldCount,
                availableUntil: edition.availableUntil?.toISOString() ?? null,
                tier: edition.tier,
              }}
              photo={{
                title: photo.title,
                imageUrl: photo.imageUrl,
                format: photo.format as "S" | "M" | "L",
              }}
              photographer={{
                id: photographer.id,
                name: authorName,
              }}
              isSignature={isSignature}
              soldOut={soldOut}
              expired={expired}
            />
          </aside>
        </div>

        {/* ── Narrative section ────────────────────────── */}
        <div className="mt-24 md:mt-48 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-3">
            <h2 className="serif-display text-sm font-black uppercase tracking-widest border-b border-primary pb-4 mb-8">
              Příběh díla
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="serif-display text-2xl md:text-3xl leading-relaxed text-on-surface mb-12">
              {photo.description || "Fotografie jako stav ticha. Každý detail je záměrný, každý stín je výsledkem trpělivého čekání."}
            </p>
            <div className="grid grid-cols-2 gap-8 md:gap-12 pt-12 border-t border-outline-variant/30">
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest font-bold text-outline block mb-4">
                  Specifikace
                </span>
                <ul className="font-body text-sm space-y-2 text-on-surface-variant">
                  <li>Formát: {photo.format === "S" ? "30 × 40" : photo.format === "M" ? "50 × 70" : "70 × 100"} cm</li>
                  <li>Papír: Hahnemühle Photo Rag Baryta</li>
                  <li>Archivní inkousty, 100+ let stálosti</li>
                  {edition.totalCount && <li>Edice: {edition.totalCount} kusů celkem</li>}
                </ul>
              </div>
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest font-bold text-outline block mb-4">
                  Certifikát
                </span>
                <ul className="font-body text-sm space-y-2 text-on-surface-variant">
                  <li>Certifikát pravosti</li>
                  <li>Vlastnoruční podpis fotografa</li>
                  <li>Pořadové číslo tisku</li>
                  <li>QR ověření pravosti</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── More from this photographer ──────────────── */}
        {photographer.photos.length > 0 && (
          <div className="mt-24 md:mt-40">
            <div className="flex justify-between items-end mb-12">
              <h3 className="serif-display text-2xl md:text-3xl font-bold">
                Další práce — {authorName}
              </h3>
              <Link
                href={`/photographer/${photographer.id}`}
                className="font-label text-xs uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity hidden md:block"
              >
                Celé portfolio →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {photographer.photos.map((p) =>
                p.editions[0] ? (
                  <PhotoCard
                    key={p.editions[0].id}
                    id={p.editions[0].id}
                    title={p.title}
                    photographerName={authorName}
                    photographerId={photographer.id}
                    imageUrl={p.imageUrl}
                    price={p.editions[0].price}
                    editionType={p.editions[0].type}
                    totalCount={p.editions[0].totalCount}
                    soldCount={p.editions[0].soldCount}
                    availableUntil={p.editions[0].availableUntil}
                  />
                ) : null
              )}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
