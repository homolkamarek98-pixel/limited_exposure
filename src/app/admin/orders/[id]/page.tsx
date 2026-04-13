import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateOrderStatus, sendShippingEmail } from "@/lib/actions";
import CreatePacketaButton from "@/components/CreatePacketaButton";
import { getLabelUrl, getTrackingUrl } from "@/lib/packeta";

export const dynamic = "force-dynamic";

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(halers / 100);
}

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Čeká na platbu",
  PAID: "Zaplaceno",
  PROCESSING: "Ve zpracování",
  SHIPPED: "Odesláno",
  DELIVERED: "Doručeno",
  CANCELLED: "Zrušeno",
  REFUNDED: "Vráceno",
};

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const carrierLabels: Record<string, string> = {
  ZASILKOVNA: "Zásilkovna",
  CZECH_POST: "Česká pošta",
  DPD: "DPD",
  PPL: "PPL",
  TOP_TRANS: "Top Trans",
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; shipped?: string }> };

export default async function AdminOrderDetailPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/auth/signin");

  const { id } = await params;
  const { saved, shipped } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          edition: {
            include: {
              photo: {
                include: {
                  photographer: { include: { user: true } },
                },
              },
            },
          },
          certificate: true,
        },
      },
      buyer: true,
    },
  });

  if (!order) notFound();

  const orderNumber = order.id.slice(-8).toUpperCase();
  const updateStatusAction = updateOrderStatus.bind(null, id);

  const allStatuses = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black mb-2 block">← Zpět na objednávky</Link>
          <h1 className="text-2xl font-bold">Objednávka #{orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString("cs-CZ", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[order.status] ?? ""}`}>
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>

      {(saved || shipped) && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 mb-6">
          {shipped ? "Email o odeslání zásilky byl odeslán." : "Stav objednávky byl uložen."}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">

        {/* Main — left 2/3 */}
        <div className="col-span-2 space-y-6">

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-sm">Objednané položky</h2>
            </div>
            {order.items.map((item) => {
              const photo = item.edition.photo;
              const authorName = photo.photographer.user.name ?? "Fotograf";
              return (
                <div key={item.id} className="flex gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.imageUrl} alt={photo.title} className="w-16 h-16 object-cover grayscale shrink-0 rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{photo.title}</p>
                    <p className="text-xs text-gray-500">{authorName}</p>
                    {item.certificate && (
                      <p className="text-xs text-gray-400 mt-1">Certifikát: {item.certificate.serialNumber}</p>
                    )}
                    <p className="text-xs text-gray-400">Č. certifikátu: {item.certificateNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatPrice(item.price)}</p>
                    <Link href={`/listing/${item.editionId}`} className="text-xs text-blue-600 hover:underline mt-1 block">
                      Zobrazit listing →
                    </Link>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
              <span className="text-sm font-semibold">Celkem</span>
              <span className="font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-sm mb-4">Platba</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-gray-500">Metoda</dt>
              <dd>{order.paymentMethod === "BANK_TRANSFER" ? "Bankovní převod" : "Karta"}</dd>
              {order.paymentReference && (
                <>
                  <dt className="text-gray-500">Variabilní symbol</dt>
                  <dd className="font-mono font-bold">{order.paymentReference}</dd>
                </>
              )}
              {order.stripePaymentId && (
                <>
                  <dt className="text-gray-500">Stripe ID</dt>
                  <dd className="font-mono text-xs">{order.stripePaymentId}</dd>
                </>
              )}
            </dl>
          </div>

          {/* Zásilkovna — vytvořit zásilku */}
          {order.carrier === "ZASILKOVNA" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm">Zásilkovna</h2>
                {order.pickupPointName && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {order.pickupPointName}
                  </span>
                )}
              </div>

              {order.packetaId ? (
                /* Zásilka již existuje */
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-xs font-semibold text-green-800 mb-1">✓ Zásilka v systému</p>
                    <p className="text-xs text-green-700 font-mono">Barcode: {order.packetaId}</p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={getLabelUrl(order.packetaId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-black text-white px-4 py-2 text-xs font-medium rounded hover:opacity-80"
                    >
                      Tisk štítku (A6) →
                    </a>
                    <a
                      href={getTrackingUrl(order.packetaId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border border-gray-300 px-4 py-2 text-xs font-medium rounded hover:border-black transition-colors"
                    >
                      Sledovat zásilku →
                    </a>
                  </div>
                </div>
              ) : (
                /* Zásilka ještě neexistuje */
                <CreatePacketaButton
                  orderId={id}
                  hasPickupPoint={!!order.pickupPointId}
                />
              )}
            </div>
          )}

          {/* Shipping email form */}
          {(order.status === "PAID" || order.status === "PROCESSING") && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-sm mb-4">Odeslat zásilku</h2>
              <form action={sendShippingEmail.bind(null, id)} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Sledovací číslo *</label>
                  <input
                    name="trackingNumber"
                    required
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">URL sledování (volitelné)</label>
                  <input
                    name="trackingUrl"
                    type="url"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="https://…"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 text-sm font-medium hover:opacity-80 transition-opacity rounded"
                >
                  Označit jako odesláno + odeslat email zákazníkovi
                </button>
              </form>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">Poznámka zákazníka</h3>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Customer */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-sm mb-4">Zákazník</h2>
            <p className="text-sm font-medium">{order.firstName} {order.lastName}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
            {order.phone && <p className="text-sm text-gray-500">{order.phone}</p>}
            {order.buyer && (
              <p className="text-xs text-gray-400 mt-2">Registrovaný účet</p>
            )}
          </div>

          {/* Delivery */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-sm mb-4">Doručení</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.addressLine1}<br />
              {order.addressLine2 && <>{order.addressLine2}<br /></>}
              {order.postalCode} {order.city}<br />
              {order.country}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Dopravce</p>
              <p className="text-sm font-medium">{carrierLabels[order.carrier] ?? order.carrier}</p>
            </div>
          </div>

          {/* Change status */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-sm mb-4">Změna stavu</h2>
            <form action={updateStatusAction}>
              <select
                name="status"
                defaultValue={order.status}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-black"
              >
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{statusLabels[s] ?? s}</option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 text-xs font-medium rounded hover:opacity-80 transition-opacity"
              >
                Uložit stav
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
