import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Uvolnění nezaplacených objednávek po 5 dnech.
// Volá Vercel Cron (viz vercel.json) jednou denně. Chráněno CRON_SECRET.
const EXPIRY_DAYS = 5;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - EXPIRY_DAYS * 24 * 3600 * 1000);

  const expired = await prisma.order.findMany({
    where: { status: "PENDING_PAYMENT", createdAt: { lt: cutoff } },
    include: { items: { select: { editionId: true } } },
  });

  let released = 0;
  for (const order of expired) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });

      // Vrať uvolněné kusy zpět do edic
      const perEdition = new Map<string, number>();
      for (const it of order.items) {
        perEdition.set(it.editionId, (perEdition.get(it.editionId) ?? 0) + 1);
      }
      for (const [editionId, qty] of perEdition) {
        const ed = await tx.edition.findUnique({ where: { id: editionId }, select: { soldCount: true } });
        const dec = Math.min(qty, ed?.soldCount ?? 0);
        if (dec > 0) {
          await tx.edition.update({ where: { id: editionId }, data: { soldCount: { decrement: dec } } });
        }
      }
    });
    released++;
  }

  return NextResponse.json({ released, cutoff: cutoff.toISOString() });
}
