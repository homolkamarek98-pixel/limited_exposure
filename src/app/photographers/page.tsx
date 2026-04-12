import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getData() {
  return prisma.photographer.findMany({
    include: {
      user: { select: { id: true, name: true } },
      photos: {
        take: 1,
        include: { editions: { take: 1 } },
        orderBy: { editions: { _count: "desc" } },
      },
    },
    orderBy: { totalSales: "desc" },
  });
}

export default async function PhotographersPage() {
  const photographers = await getData();

  return (
    <>
      <Nav active="photographers" />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">

        {/* Header */}
        <div className="border-b border-outline-variant/30 pb-12 mb-16 md:mb-20">
          <span className="font-label text-xs uppercase tracking-widest text-secondary block mb-4">Kurátorský roster</span>
          <h1 className="serif-display text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Autoři
          </h1>
        </div>

        {/* List */}
        <div className="divide-y divide-outline-variant/20">
          {photographers.map((p, i) => {
            const name = p.user.name ?? "Neznámý fotograf";
            const coverPhoto = p.photos[0];
            return (
              <Link
                key={p.id}
                href={`/photographer/${p.id}`}
                className="group flex items-center gap-8 md:gap-16 py-8 md:py-10 hover:bg-surface-container-low transition-colors -mx-6 md:-mx-12 px-6 md:px-12"
              >
                {/* Index */}
                <span className="font-label text-xs text-outline w-8 shrink-0 hidden md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Thumbnail */}
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 overflow-hidden bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/portrait-${p.id}/160/160`}
                    alt={name}
                    className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="serif-display text-2xl md:text-4xl font-black tracking-tighter leading-none mb-2 group-hover:opacity-60 transition-opacity">
                    {name}
                  </h2>
                  {p.instagram && (
                    <span className="font-label text-xs text-outline uppercase tracking-widest">{p.instagram}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-16 shrink-0">
                  <div className="text-right">
                    <div className="serif-display text-2xl font-bold">{p.totalSales}</div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-outline">Prodaná díla</span>
                  </div>
                  <div className="text-right">
                    <div className="serif-display text-2xl font-bold">{p.photos.length}</div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-outline">Aktivní edice</span>
                  </div>
                </div>

                {/* Arrow */}
                <span className="font-label text-xs text-outline group-hover:translate-x-2 transition-transform shrink-0">→</span>
              </Link>
            );
          })}
        </div>

      </main>
      <Footer />
    </>
  );
}
