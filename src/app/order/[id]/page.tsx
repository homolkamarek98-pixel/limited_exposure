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
                include: { photographer: { include: { user: true } } },
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
      <main className="min-h-screen bg-[#f9f9f9]">

        {/* Hero — potvrzení */}
        <section className="bg-black text-white py-20 md:py-28 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-2xl">
              {/* Check */}
              <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-4">
                Objednávka #{orderNumber}
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
                Objednávka<br />přijata.
              </h1>
              <p className="font-body text-base text-white/60 leading-relaxed max-w-md">
                Vaše pořadová čísla jsou rezervována. Proveďte prosím bankovní převod níže
                a objednávka bude zpracována do 24 hodin.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">

            {/* Left — hlavní obsah */}
            <div className="lg:col-span-7 space-y-8">

              {/* Platební instrukce */}
              <div className="bg-white border border-[#e8e8e8] p-8">
                <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-6 pb-4 border-b border-[#e8e8e8]">
                  Platební instrukce
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Číslo účtu", value: "1234567890 / 0800", mono: true },
                    { label: "Variabilní symbol", value: order.paymentReference ?? "—", mono: true, highlight: true },
                    { label: "Částka", value: formatPrice(order.totalAmount), mono: false },
                    { label: "Banka", value: "Česká spořitelna", mono: false },
                  ].map(({ label, value, mono, highlight }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-[#f3f3f3] last:border-0">
                      <span className="font-label text-[10px] uppercase tracking-widest text-[#999]">{label}</span>
                      <span className={[
                        mono ? "font-mono" : "font-body",
                        highlight ? "text-xl font-black tracking-widest" : "text-sm font-semibold",
                      ].join(" ")}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-[#f9f9f9] px-4 py-3">
                  <p className="font-label text-[9px] uppercase tracking-widest text-[#aaa]">
                    Rezervace platná 5 pracovních dní · Objednávka bude zpracována po připsání platby
                  </p>
                </div>
              </div>

              {/* Objednané položky */}
              <div className="bg-white border border-[#e8e8e8]">
                <div className="px-8 py-5 border-b border-[#e8e8e8]">
                  <h2 className="font-label text-[10px] uppercase tracking-widest font-bold">
                    Vaše díla ({order.items.length})
                  </h2>
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
                      <div className="flex-1 min-w-0">
                        <p className="font-headline text-sm font-bold uppercase tracking-tight mb-1">{photo.title}</p>
                        <p className="font-label text-[10px] uppercase tracking-widest text-[#999] mb-3">{authorName}</p>
                        {item.certificate && (
                          <div className="inline-flex items-center gap-2 border border-[#e8e8e8] px-3 py-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="font-label text-[9px] uppercase tracking-widest">
                              Certifikát {item.certificate.serialNumber}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-headline text-sm font-bold shrink-0">{formatPrice(item.price)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between px-8 py-5 bg-[#f9f9f9] border-t border-[#e8e8e8]">
                  <span className="font-label text-[10px] uppercase tracking-widest font-bold">Celkem vč. dopravy</span>
                  <span className="font-headline text-base font-black">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

            </div>

            {/* Right — sidebar */}
            <div className="lg:col-span-5 space-y-6">

              {/* Co se stane dál */}
              <div className="bg-white border border-[#e8e8e8] p-8">
                <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-6 pb-4 border-b border-[#e8e8e8]">
                  Co se stane dál
                </h2>
                <ol className="space-y-5">
                  {[
                    { n: "1", title: "Proveďte platbu", body: "Převeďte prosím částku na účet výše s variabilním symbolem." },
                    { n: "2", title: "Zpracování objednávky", body: "Po připsání platby připravíme tisk do 2–3 pracovních dnů." },
                    { n: "3", title: "Doručení a certifikát", body: "Zásilka s certifikátem pravosti bude odeslána pojištěnou dopravou." },
                  ].map(({ n, title, body }) => (
                    <li key={n} className="flex gap-4">
                      <div className="w-6 h-6 bg-black text-white flex items-center justify-center shrink-0 font-label text-[10px] font-bold mt-0.5">
                        {n}
                      </div>
                      <div>
                        <p className="font-label text-xs uppercase tracking-widest font-bold mb-1">{title}</p>
                        <p className="font-body text-xs text-[#777] leading-relaxed">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Doručení */}
              <div className="bg-white border border-[#e8e8e8] p-8">
                <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-4">Doručení</h2>
                <p className="font-body text-sm text-[#474747] leading-relaxed">
                  {order.firstName} {order.lastName}<br />
                  {order.carrier === "ZASILKOVNA" && order.pickupPointName
                    ? order.pickupPointName
                    : <>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br />{order.postalCode} {order.city}</>
                  }
                </p>
                <div className="mt-3 pt-3 border-t border-[#f3f3f3]">
                  <span className="font-label text-[9px] uppercase tracking-widest text-[#bbb]">
                    {carrierLabels[order.carrier] ?? order.carrier}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <Link
                  href="/gallery"
                  className="block w-full text-center border border-[#e8e8e8] font-label text-[10px] uppercase tracking-widest py-4 hover:border-black transition-colors bg-white"
                >
                  Pokračovat v nakupování →
                </Link>
                <Link
                  href="/"
                  className="block w-full text-center bg-black text-white font-label text-[10px] uppercase tracking-widest py-4 hover:opacity-80 transition-opacity"
                >
                  Zpět na hlavní stránku
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
