import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(halers / 100);
}

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Čeká na platbu",
  PAID: "Zaplaceno",
  PROCESSING: "Ve zpracování",
  SHIPPED: "Odesláno",
  DELIVERED: "Doručeno",
  CANCELLED: "Zrušeno",
  REFUNDED: "Vráceno",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/auth/signin");

  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" } : undefined,
    include: {
      items: {
        include: {
          edition: { include: { photo: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  const filterTabs = [
    { label: "Vše", value: undefined },
    { label: "Čeká na platbu", value: "PENDING_PAYMENT" },
    { label: "Zaplaceno", value: "PAID" },
    { label: "Ve zpracování", value: "PROCESSING" },
    { label: "Odesláno", value: "SHIPPED" },
    { label: "Doručeno", value: "DELIVERED" },
    { label: "Zrušeno", value: "CANCELLED" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Objednávky</h1>
        <span className="text-sm text-gray-500">{orders.length} objednávek</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Čeká na platbu", key: "PENDING_PAYMENT", color: "bg-yellow-50 border-yellow-200" },
          { label: "Zaplaceno", key: "PAID", color: "bg-blue-50 border-blue-200" },
          { label: "Odesláno", key: "SHIPPED", color: "bg-indigo-50 border-indigo-200" },
          { label: "Doručeno", key: "DELIVERED", color: "bg-green-50 border-green-200" },
        ].map(({ label, key, color }) => (
          <div key={key} className={`border rounded-lg p-4 ${color}`}>
            <div className="text-2xl font-bold">
              {counts.find(c => c.status === key)?._count ?? 0}
            </div>
            <div className="text-xs text-gray-600 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterTabs.map(({ label, value }) => {
          const active = status === value || (!status && value === undefined);
          const href = value ? `/admin/orders?status=${value}` : "/admin/orders";
          return (
            <Link
              key={label}
              href={href}
              className={[
                "px-4 py-2 text-xs font-medium rounded-full transition-colors",
                active ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {label}
              {value && (
                <span className="ml-2 opacity-60">
                  {counts.find(c => c.status === value)?._count ?? 0}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Objednávka</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Zákazník</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Položky</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Celkem</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Stav</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                  {order.paymentReference && (
                    <div className="text-xs text-gray-400 mt-0.5">VS: {order.paymentReference}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{order.firstName} {order.lastName}</div>
                  <div className="text-gray-400 text-xs">{order.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-0.5">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="text-gray-600">{item.edition.photo.title}</div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-gray-400">+{order.items.length - 2} další</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold">{formatPrice(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString("cs-CZ")}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs font-medium text-black hover:underline"
                  >
                    Detail →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Žádné objednávky
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
