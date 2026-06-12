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
        <div className="border-b border-[#e7dfd2] pb-12 mb-16 md:mb-20">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-4">Kurátorský roster</span>
          <h1 className="text-5xl md:text-7xl font-medium tracking-[-0.03em] leading-[0.95] text-[#1a1714]">
            Autoři
          </h1>
        </div>

        {/* List */}
        <div className="divide-y divide-[#e7dfd2] border-b border-[#e7dfd2]">
          {photographers.map((p, i) => {
            const name = p.user.name ?? "Neznámý fotograf";
            const coverPhoto = p.photos[0];
            return (
              <Link
                key={p.id}
                href={`/photographer/${p.id}`}
                className="group flex items-center gap-8 md:gap-16 py-8 md:py-10 hover:bg-[#f3ede3]/50 transition-colors -mx-6 md:-mx-12 px-6 md:px-12"
              >
                {/* Index */}
                <span className="otisk-mono text-xs text-[#c4bba9] w-8 shrink-0 hidden md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Thumbnail */}
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 overflow-hidden bg-[#f3ede3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/portrait-${p.id}/160/160`}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] leading-none mb-2 text-[#1a1714] group-hover:text-[#57503f] transition-colors">
                    {name}
                  </h2>
                  {p.instagram && (
                    <span className="text-[10px] text-[#8a8170] uppercase tracking-[0.18em]">{p.instagram}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-16 shrink-0">
                  <div className="text-right">
                    <div className="otisk-mono text-2xl font-medium">{p.totalSales}</div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170]">Prodaná díla</span>
                  </div>
                  <div className="text-right">
                    <div className="otisk-mono text-2xl font-medium">{p.photos.length}</div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170]">Aktivní edice</span>
                  </div>
                </div>

                {/* Arrow */}
                <span className="text-xs text-[#8a8170] group-hover:translate-x-2 group-hover:text-[#1a1714] transition-all shrink-0">→</span>
              </Link>
            );
          })}
        </div>

      </main>
      <Footer />
    </>
  );
}
