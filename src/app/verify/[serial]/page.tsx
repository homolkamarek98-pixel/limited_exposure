import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ serial: string }> };

export default async function VerifyPage({ params }: Props) {
  const { serial } = await params;
  // serial v URL je URL-encoded (pomlčky, lomítka) — dekóduj
  const serialNumber = decodeURIComponent(serial);

  const certificate = await prisma.certificate.findFirst({
    where: { serialNumber },
    include: {
      orderItem: {
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
        },
      },
      order: {
        select: { createdAt: true, status: true },
      },
    },
  });

  if (!certificate) notFound();

  const { orderItem, order } = certificate;
  const { edition } = orderItem;
  const { photo } = edition;
  const photographer = photo.photographer;
  const authorName = photographer.user.name ?? "Fotograf";

  const formatLabel = photo.format === "S" ? "30 × 40 cm" : photo.format === "M" ? "50 × 70 cm" : "70 × 100 cm";
  const editionDesc = edition.totalCount
    ? `Limitovaná edice ${edition.totalCount} kusů`
    : "Časově limitovaná edice";

  const issuedAt = new Date(order.createdAt);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#f9f9f9]">

        {/* Verification header */}
        <section className="bg-black text-white px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 border border-green-400/50 flex items-center justify-center shrink-0 mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest text-green-400 block mb-2">
                  Ověřeno · Archiv Limited Exposure
                </span>
                <h1 className="font-headline text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight">
                  Certifikát pravosti<br />byl ověřen.
                </h1>
                <p className="font-body text-white/50 text-sm mt-4 max-w-lg">
                  Níže uvedený tisk je registrovaným originálem v archivu Limited Exposure.
                  Záznam je trvalý a neměnný.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Certificate card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#e8e8e8] p-8 md:p-12">

                {/* Header certifikátu */}
                <div className="flex justify-between items-start mb-10 pb-8 border-b border-[#e8e8e8]">
                  <div>
                    <span className="font-label text-[9px] uppercase tracking-[0.25em] text-[#aaa] block mb-1">
                      Certifikát pravosti
                    </span>
                    <span className="font-label text-[9px] uppercase tracking-[0.25em] text-[#aaa]">
                      Limited Exposure · Archivní záznam
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-[#aaa] block">{certificate.serialNumber}</span>
                  </div>
                </div>

                {/* Dílo */}
                <div className="flex gap-6 mb-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-24 h-24 object-cover grayscale shrink-0"
                  />
                  <div>
                    <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-1">
                      {photo.title}
                    </h2>
                    <Link
                      href={`/photographer/${photographer.id}`}
                      className="font-body text-base text-[#777] hover:text-black transition-colors"
                    >
                      {authorName}
                    </Link>
                  </div>
                </div>

                {/* Specifikace */}
                <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-[#e8e8e8]">
                  {[
                    { label: "Pořadové číslo", value: certificate.serialNumber },
                    { label: "Edice", value: editionDesc },
                    { label: "Formát", value: formatLabel },
                    { label: "Papír", value: "Hahnemühle Photo Rag Baryta" },
                    { label: "Tisk vydán", value: issuedAt.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" }) },
                    { label: "Archivní stálost", value: "100+ let" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="font-label text-[9px] uppercase tracking-widest text-[#aaa] block mb-1">{label}</span>
                      <span className="font-body text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Podpis + QR */}
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-label text-[9px] uppercase tracking-widest text-[#aaa] block mb-3">Podpis fotografa</span>
                    <span className="font-body italic text-2xl text-[#ccc]">{authorName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-label text-[9px] uppercase tracking-widest text-[#aaa] block mb-2">QR ověření</span>
                    {/* QR placeholder — generuje se automaticky z URL */}
                    <div className="w-16 h-16 bg-[#f3f3f4] border border-[#e8e8e8] flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                        <rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/>
                        <rect x="18" y="18" width="3" height="3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-5 space-y-6">

              {/* Ověření */}
              <div className="bg-green-50 border border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="square">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-widest font-bold text-green-800">
                    Tisk ověřen
                  </span>
                </div>
                <p className="font-body text-sm text-green-700 leading-relaxed">
                  Tento tisk je registrovaným originálem v archivu Limited Exposure.
                  Číslo edice a specifikace odpovídají záznamu v databázi.
                </p>
              </div>

              {/* Fotograf */}
              <div className="bg-white border border-[#e8e8e8] p-6">
                <span className="font-label text-[9px] uppercase tracking-widest text-[#aaa] block mb-4">Fotograf</span>
                <p className="font-headline text-xl font-bold mb-1">{authorName}</p>
                <Link
                  href={`/photographer/${photographer.id}`}
                  className="font-label text-[10px] uppercase tracking-widest text-[#777] hover:text-black transition-colors"
                >
                  Zobrazit portfolio →
                </Link>
              </div>

              {/* Co je archivní záznam */}
              <div className="bg-white border border-[#e8e8e8] p-6">
                <span className="font-label text-[9px] uppercase tracking-widest text-[#aaa] block mb-4">
                  O archivním záznamu
                </span>
                <p className="font-body text-sm text-[#474747] leading-relaxed">
                  Každý prodaný tisk je při vydání registrován v digitálním archivu Limited Exposure.
                  Záznam obsahuje kompletní specifikaci díla a edice a je dostupný trvale prostřednictvím QR kódu na fyzickém certifikátu.
                </p>
              </div>

              <Link
                href={`/listing/${edition.id}`}
                className="block w-full text-center border border-[#e8e8e8] bg-white font-label text-[10px] uppercase tracking-widest py-4 hover:border-black transition-colors"
              >
                Zobrazit edici →
              </Link>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
