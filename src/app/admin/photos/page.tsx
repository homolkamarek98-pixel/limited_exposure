import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ saved?: string; deleted?: string }>;

async function getData() {
  return prisma.photo.findMany({
    include: {
      photographer: { include: { user: { select: { name: true } } } },
      editions: { select: { id: true, tier: true, price: true, soldCount: true } },
    },
    orderBy: { title: "asc" },
  });
}

function formatPrice(halere: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(halere / 100);
}

export default async function AdminPhotosPage({ searchParams }: { searchParams: SearchParams }) {
  const { saved, deleted } = await searchParams;
  const photos = await getData();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="serif-display text-3xl font-black tracking-tighter mb-1">Fotografie</h1>
          <p className="font-body text-sm text-on-surface-variant">{photos.length} fotografií</p>
        </div>
        <Link
          href="/admin/photos/new"
          className="bg-primary text-on-primary px-6 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          + Nová fotografie
        </Link>
      </div>

      {(saved || deleted) && (
        <div className="bg-surface-container-low border border-outline-variant/20 px-6 py-4 font-label text-xs uppercase tracking-widest text-secondary">
          {saved ? "Změny uloženy." : "Fotografie smazána."}
        </div>
      )}

      <div className="bg-surface border border-outline-variant/20 divide-y divide-outline-variant/20">
        {photos.map((photo) => (
          <div key={photo.id} className="flex items-center justify-between px-6 py-5 hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-5">
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-12 h-12 object-cover grayscale shrink-0"
              />
              <div className="space-y-1">
                <div className="font-body font-medium">{photo.title}</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-outline">
                  {photo.photographer.user.name ?? "—"} · {photo.format}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end gap-1">
                {photo.editions.map((e) => (
                  <span key={e.id} className="font-label text-[10px] uppercase tracking-widest text-outline">
                    {e.tier === "SIGNATURE" ? "Sig." : "Rising"} · {formatPrice(e.price)}
                  </span>
                ))}
                {photo.editions.length === 0 && (
                  <span className="font-label text-[10px] uppercase tracking-widest text-error">Bez edice</span>
                )}
              </div>
              <Link
                href={`/admin/photos/${photo.id}`}
                className="font-label text-xs uppercase tracking-widest border border-outline-variant/30 px-4 py-2 hover:border-primary hover:text-primary transition-colors"
              >
                Upravit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
