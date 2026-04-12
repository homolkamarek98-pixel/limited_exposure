import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [photographers, photos, editions, orders] = await Promise.all([
    prisma.photographer.count(),
    prisma.photo.count(),
    prisma.edition.count(),
    prisma.order.count(),
  ]);
  return { photographers, photos, editions, orders };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Fotografové", value: stats.photographers, href: "/admin/photographers" },
    { label: "Fotografie", value: stats.photos, href: "/admin/photos" },
    { label: "Edice", value: stats.editions, href: "/admin/editions" },
    { label: "Objednávky", value: stats.orders, href: "#" },
  ];

  const quickActions = [
    { label: "Nová fotografie", href: "/admin/photos/new" },
    { label: "Nová edice", href: "/admin/editions/new" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="serif-display text-3xl font-black tracking-tighter mb-1">Dashboard</h1>
        <p className="font-body text-sm text-on-surface-variant">Správa obsahu Limited Exposure.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-surface border border-outline-variant/20 p-6 hover:border-primary transition-colors group"
          >
            <div className="serif-display text-4xl font-black mb-2 group-hover:text-primary transition-colors">
              {value}
            </div>
            <div className="font-label text-[10px] uppercase tracking-widest text-outline">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">Rychlé akce</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-primary text-on-primary px-6 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
