import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20 border-b border-[#e7dfd2] pb-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Kurátorský výběr</span>
            <h1 className="text-5xl md:text-7xl font-medium tracking-[-0.03em] leading-[0.95] text-[#1a1714]">
              Aktuální nabídka
            </h1>
          </div>
          <p className="text-base text-[#57503f] leading-relaxed max-w-sm">
            Limitované edice kurátorsky vybraných fotografů. Každé dílo opatřeno certifikátem pravosti a pořadovým číslem.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-16">
          {tabs.map(({ label, value }) => {
            const active = tier === value || (!tier && value === undefined);
            const href = value ? `/gallery?tier=${value}` : "/gallery";
            return (
              <Link
                key={label}
                href={href}
                className={[
                  "text-[10px] uppercase tracking-[0.2em] px-6 py-3 transition-colors",
                  active
                    ? "border border-[#1a1714] bg-[#1a1714] text-[#faf6f0]"
                    : "border border-[#e7dfd2] text-[#57503f] hover:border-[#1a1714] hover:text-[#1a1714]",
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
            <p className="text-[#8a8170]">Žádné edice v této kategorii.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-20">
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
