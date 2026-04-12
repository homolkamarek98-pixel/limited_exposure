import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ tier?: string }>;

async function getData(tier?: string) {
  return prisma.edition.findMany({
    where: tier === "RISING_TALENT" || tier === "SIGNATURE"
      ? { tier: tier as "RISING_TALENT" | "SIGNATURE" }
      : undefined,
    include: {
      photo: {
        include: {
          photographer: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
    },
    orderBy: [{ tier: "desc" }, { photo: { photographer: { totalSales: "desc" } } }],
  });
}

export default async function GalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const { tier } = await searchParams;
  const editions = await getData(tier);

  const tabs = [
    { label: "Vše", value: undefined },
    { label: "Rising Talents", value: "RISING_TALENT" },
    { label: "Signature Series", value: "SIGNATURE" },
  ];

  return (
    <>
      <Nav active="gallery" />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20 border-b border-outline-variant/30 pb-12">
          <div className="space-y-4">
            <span className="font-label text-xs uppercase tracking-widest text-secondary">Kurátorský výběr</span>
            <h1 className="serif-display text-5xl md:text-7xl font-black tracking-tighter leading-none">
              The Gallery
            </h1>
          </div>
          <p className="font-body text-base text-on-surface-variant max-w-sm">
            Limitované edice kurátorsky vybraných fotografů. Každé dílo opatřeno certifikátem pravosti a pořadovým číslem.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-16">
          {tabs.map(({ label, value }) => {
            const active = tier === value || (!tier && value === undefined);
            const href = value ? `/gallery?tier=${value}` : "/gallery";
            return (
              <Link
                key={label}
                href={href}
                className={[
                  "font-label text-xs uppercase tracking-widest px-6 py-3 transition-colors",
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {editions.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-body text-secondary">Žádné edice v této kategorii.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {editions.map((edition) => (
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

      </main>
      <Footer />
    </>
  );
}
