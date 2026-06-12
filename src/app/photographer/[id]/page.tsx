import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PhotoCard from "@/components/PhotoCard";
import { prisma } from "@/lib/prisma";

async function getData(id: string) {
  return prisma.photographer.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      photos: {
        include: { editions: { take: 1, orderBy: { soldCount: "desc" } } },
        orderBy: { editions: { _count: "desc" } },
      },
    },
  });
}

type Props = { params: Promise<{ id: string }> };

export default async function PhotographerPage({ params }: Props) {
  const { id } = await params;
  const photographer = await getData(id);
  if (!photographer) notFound();

  const name = photographer.user.name ?? "Neznámý fotograf";
  const worksWithEditions = photographer.photos.filter((p) => p.editions.length > 0);
  const totalEditions = worksWithEditions.length;

  return (
    <>
      <Nav active="photographers" />
      <main className="max-w-screen-2xl mx-auto">

        {/* ── Hero — 1/2 + 1/2 ────────────────────────── */}
        <section className="flex flex-col md:flex-row min-h-[600px] md:min-h-[780px] px-6 md:px-12 pt-12 md:pt-16 gap-12 md:gap-16 items-center">
          {/* Portrait */}
          <div className="w-full md:w-1/2 relative">
            <div className="bg-[#f3ede3] p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/portrait-${photographer.id}/600/750`}
                alt={`Portrét — ${name}`}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            {/* Quote overlay */}
            {photographer.bio && (
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 le-glass p-6 md:p-8 max-w-[280px] border border-[#e7dfd2]">
                <p className="italic text-base md:text-lg leading-relaxed text-[#57503f]">
                  &ldquo;{photographer.bio.slice(0, 100)}&hellip;&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col items-start pb-8 md:pb-0">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-4 text-[#8a8170]">
              Fotograf
            </span>
            <h1 className="font-medium text-6xl md:text-8xl tracking-[-0.04em] leading-[0.95] text-[#1a1714] mb-8">
              {name.split(" ").map((part, i) => (
                <span key={i} className="block">{part}</span>
              ))}
            </h1>
            <div className="max-w-md">
              <p className="text-base md:text-lg leading-relaxed text-[#57503f] mb-8">
                {photographer.bio}
              </p>
              {photographer.instagram && (
                <p className="text-[10px] text-[#8a8170] uppercase tracking-[0.18em] mb-8">
                  {photographer.instagram}
                </p>
              )}
              <button className="bg-[#1a1714] text-[#faf6f0] px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors">
                Sledovat fotografa
              </button>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────── */}
        <section className="mt-24 md:mt-32 border-y border-[#e7dfd2]">
          <div className="px-6 md:px-12 py-16 md:py-24 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Prodaná díla</span>
              <div className="otisk-mono text-5xl font-medium tracking-[-0.02em]">{photographer.totalSales}</div>
              <p className="text-sm text-[#57503f] leading-relaxed max-w-[200px]">
                Limitovaných tisků v soukromých kolekcích.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Aktivní edice</span>
              <div className="otisk-mono text-5xl font-medium tracking-[-0.02em]">{totalEditions}</div>
              <p className="text-sm text-[#57503f] leading-relaxed max-w-[200px]">
                Dostupné práce na Otisk.
              </p>
            </div>
            <div className="flex flex-col space-y-4 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Kontakt</span>
              <div className="text-2xl font-medium tracking-[-0.02em]">{photographer.instagram || "—"}</div>
              <p className="text-sm text-[#57503f] max-w-[200px]">Instagram</p>
            </div>
          </div>
        </section>

        {/* ── Collected Works ───────────────────────────── */}
        <section className="px-6 md:px-12 py-16 md:py-28">
          <h2 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] mb-16 md:mb-20">
            Kolekce prací
          </h2>

          {worksWithEditions.length === 0 ? (
            <p className="text-[#8a8170] py-16 text-center">
              Fotograf zatím nemá žádné aktivní edice.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
              {worksWithEditions.map((photo, i) => {
                const edition = photo.editions[0];
                return (
                  <PhotoCard
                    key={edition.id}
                    id={edition.id}
                    title={photo.title}
                    photographerName={name}
                    photographerId={photographer.id}
                    imageUrl={photo.imageUrl}
                    price={edition.price}
                    editionType={edition.type}
                    totalCount={edition.totalCount}
                    soldCount={edition.soldCount}
                    availableUntil={edition.availableUntil}
                    offset={i === 1 ? true : i === 2 ? false : undefined}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* ── Secure your place CTA ─────────────────────── */}
        <section className="border-t border-[#e7dfd2]">
          <div className="px-6 md:px-12 py-16 md:py-28 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-4xl font-medium tracking-[-0.02em] leading-[1.05] text-[#1a1714]">
                Zajistěte si místo<br />v digitálním archivu.
              </h3>
              <p className="text-[#57503f] leading-relaxed max-w-md text-sm">
                Limitované edice jsou dostupné jen po omezenou dobu nebo do vyčerpání nákladu. Každý tisk je certifikován a číslován.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block bg-[#1a1714] text-[#faf6f0] px-10 md:px-16 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors whitespace-nowrap"
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
