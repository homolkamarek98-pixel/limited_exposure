import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ saved?: string; deleted?: string; created?: string }>;

async function getData() {
  return prisma.edition.findMany({
    include: {
      photo: {
        include: { photographer: { include: { user: { select: { name: true } } } } },
      },
    },
    orderBy: [{ tier: "desc" }, { photo: { title: "asc" } }],
  });
}

function formatPrice(halere: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(halere / 100);
}

export default async function AdminEditionsPage({ searchParams }: { searchParams: SearchParams }) {
  const { saved, deleted, created } = await searchParams;
  const editions = await getData();

  const message = created ? "Edice vytvořena." : saved ? "Změny uloženy." : deleted ? "Edice smazána." : null;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="serif-display text-3xl font-black tracking-tighter mb-1">Edice</h1>
          <p className="font-body text-sm text-on-surface-variant">{editions.length} edic</p>
        </div>
        <Link href="/admin/editions/new" className="bg-primary text-on-primary px-6 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
          + Nová edice
        </Link>
      </div>

      {message && (
        <div className="bg-surface-container-low border border-outline-variant/20 px-6 py-4 font-label text-xs uppercase tracking-widest text-secondary">
          {message}
        </div>
      )}

      <div className="bg-surface border border-outline-variant/20 divide-y divide-outline-variant/20">
        {editions.map((e) => {
          const soldOut = e.type === "LIMITED_COUNT" && e.totalCount !== null && e.soldCount >= e.totalCount;
          const expired = e.type === "TIME_WINDOW" && e.availableUntil !== null && e.availableUntil < new Date();

          return (
            <div key={e.id} className="flex items-center justify-between px-6 py-5 hover:bg-surface-container-low transition-colors">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-body font-medium">{e.photo.title}</span>
                  <span className={[
                    "font-label text-[10px] uppercase tracking-widest px-2 py-0.5",
                    e.tier === "SIGNATURE" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant",
                  ].join(" ")}>
                    {e.tier === "SIGNATURE" ? "Signature" : "Rising"}
                  </span>
                  {(soldOut || expired) && (
                    <span className="font-label text-[10px] uppercase tracking-widest text-error">
                      {soldOut ? "Vyprodáno" : "Expirováno"}
                    </span>
                  )}
                </div>
                <div className="font-label text-[10px] uppercase tracking-widest text-outline">
                  {e.photo.photographer.user.name ?? "—"} · {formatPrice(e.price)}
                  {e.type === "LIMITED_COUNT" && e.totalCount && ` · ${e.soldCount}/${e.totalCount}`}
                  {e.type === "TIME_WINDOW" && e.availableUntil && ` · do ${e.availableUntil.toLocaleDateString("cs-CZ")}`}
                </div>
              </div>
              <Link
                href={`/admin/editions/${e.id}`}
                className="font-label text-xs uppercase tracking-widest border border-outline-variant/30 px-4 py-2 hover:border-primary hover:text-primary transition-colors shrink-0 ml-4"
              >
                Upravit
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
