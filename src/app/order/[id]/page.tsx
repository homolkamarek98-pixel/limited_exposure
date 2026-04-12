import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(halers / 100);
}

const carrierLabels: Record<string, string> = {
  ZASILKOVNA: "Zásilkovna",
  CZECH_POST: "Česká pošta",
  DPD: "DPD",
  PPL: "PPL",
  TOP_TRANS: "Top Trans",
};

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
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
    },
  });

  if (!order) notFound();

  const orderNumber = order.id.slice(-8).toUpperCase();

  return (
    <>
      <Nav />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="font-label text-xs uppercase tracking-widest text-[#777] block mb-4">
            Objednávka #{orderNumber}
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
            Objednávka přijata
          </h1>
          <p className="font-body text-base text-[#474747] leading-relaxed">
            Potvrzení bylo odesláno na <strong>{order.email}</strong>.<br />
            Pro dokončení objednávky proveďte bankovní převod níže.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">

          {/* Payment instructions */}
          <div className="bg-[#f3f3f4] p-8">
            <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-6">Platební instrukce</h2>
            <div className="grid grid-cols-2 gap-y-4 font-body text-sm">
              <span className="text-[#777]">Číslo účtu</span>
              <span className="font-bold">1234567890 / 0800</span>
              <span className="text-[#777]">Variabilní symbol</span>
              <span className="font-black text-lg">{order.paymentReference}</span>
              <span className="text-[#777]">Částka</span>
              <span className="font-bold">{formatPrice(order.totalAmount)}</span>
              <span className="text-[#777]">Banka</span>
              <span>Česká spořitelna</span>
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-[#aaa] mt-6">
              Rezervace platná 5 pracovních dní
            </p>
          </div>

          {/* Order items */}
          <div className="border border-[#e8e8e8]">
            <div className="px-8 py-4 border-b border-[#e8e8e8]">
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold">Objednané položky</h2>
            </div>
            {order.items.map((item) => {
              const photo = item.edition.photo;
              const authorName = photo.photographer.user.name ?? "Fotograf";
              return (
                <div key={item.id} className="flex gap-6 px-8 py-6 border-b border-[#e8e8e8] last:border-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-20 h-20 object-cover grayscale shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-headline text-sm font-bold uppercase tracking-tight">{photo.title}</p>
                    <p className="font-label text-[10px] uppercase tracking-widest text-[#777] mb-2">{authorName}</p>
                    {item.certificate && (
                      <p className="font-label text-[10px] text-[#aaa]">
                        Certifikát: {item.certificate.serialNumber}
                      </p>
                    )}
                  </div>
                  <span className="font-headline text-sm font-bold shrink-0">{formatPrice(item.price)}</span>
                </div>
              );
            })}
            <div className="flex justify-between px-8 py-4 border-t border-[#e8e8e8] bg-[#fafafa]">
              <span className="font-label text-xs uppercase tracking-widest font-bold">Celkem</span>
              <span className="font-headline text-base font-black">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="border border-[#e8e8e8] px-8 py-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-4">Doručení</h2>
            <p className="font-body text-sm text-[#474747] leading-relaxed">
              {order.firstName} {order.lastName}<br />
              {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br />
              {order.postalCode} {order.city}<br />
              Dopravce: {carrierLabels[order.carrier] ?? order.carrier}
            </p>
          </div>

          {/* CTA */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/gallery"
              className="flex-1 text-center border border-[#e8e8e8] font-label text-[10px] uppercase tracking-widest py-4 hover:border-black transition-colors"
            >
              Pokračovat v nakupování
            </Link>
            <Link
              href="/"
              className="flex-1 text-center bg-black text-white font-label text-[10px] uppercase tracking-widest py-4 hover:opacity-80 transition-opacity"
            >
              Zpět na hlavní stránku
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
