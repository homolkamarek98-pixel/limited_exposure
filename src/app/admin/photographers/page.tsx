import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ saved?: string }>;

async function getData() {
  return prisma.photographer.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { totalSales: "desc" },
  });
}

export default async function AdminPhotographersPage({ searchParams }: { searchParams: SearchParams }) {
  const { saved } = await searchParams;
  const photographers = await getData();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="serif-display text-3xl font-black tracking-tighter mb-1">Fotografové</h1>
          <p className="font-body text-sm text-on-surface-variant">{photographers.length} fotografů</p>
        </div>
      </div>

      {saved && (
        <div className="bg-surface-container-low border border-outline-variant/20 px-6 py-4 font-label text-xs uppercase tracking-widest text-secondary">
          Změny uloženy.
        </div>
      )}

      <div className="bg-surface border border-outline-variant/20 divide-y divide-outline-variant/20">
        {photographers.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-6 py-5 hover:bg-surface-container-low transition-colors">
            <div className="space-y-1">
              <div className="font-body font-medium">{p.user.name ?? "—"}</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-outline">{p.user.email}</div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right hidden md:block">
                <div className="font-body text-sm font-medium">{p.totalSales}</div>
                <div className="font-label text-[10px] uppercase tracking-widest text-outline">Prodeje</div>
              </div>
              <div className="font-label text-[10px] uppercase tracking-widest text-outline hidden md:block">
                {p.instagram || "—"}
              </div>
              <Link
                href={`/admin/photographers/${p.id}`}
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
