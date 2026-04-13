import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import ListingProductView from "@/components/ListingProductView";
import { prisma } from "@/lib/prisma";

async function getData(id: string) {
  const [edition, takenNumbers] = await Promise.all([
    prisma.edition.findUnique({
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
    }),
    // Obsazená čísla: orderItems pro tuto edici s certificateNumber
    prisma.orderItem.findMany({
      where: { editionId: id },
      select: { certificateNumber: true },
    }),
  ]);

  if (!edition) return null;

  // Filtrujeme aktuální foto mimo "Další práce"
  edition.photo.photographer.photos = edition.photo.photographer.photos.filter(
    (p) => p.id !== edition.photo.id
  );

  const takenSet = takenNumbers.map((o) => o.certificateNumber);

  return { edition, takenNumbers: takenSet };
}

type Props = { params: Promise<{ id: string }> };

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();

  const { edition, takenNumbers } = data;
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

        {/* ── Product View — frame preview + sidebar ──── */}
        <ListingProductView
          imageUrl={photo.imageUrl}
          imageAlt={photo.title}
          photoFormat={photo.format as "S" | "M" | "L"}
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
          photographer={{ id: photographer.id, name: authorName }}
          isSignature={isSignature}
          soldOut={soldOut}
          expired={expired}
          takenNumbers={takenNumbers}
        />

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
