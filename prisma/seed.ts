import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Picsum photos — konzistentní placeholder fotografie (grayscale přes CSS)
const PHOTOS = [
  "https://picsum.photos/seed/portrait-man/800/1060",
  "https://picsum.photos/seed/mountain-fog/800/1060",
  "https://picsum.photos/seed/arch-staircase/800/1060",
  "https://picsum.photos/seed/dark-forest/800/1060",
  "https://picsum.photos/seed/abstract-smoke/800/1060",
  "https://picsum.photos/seed/portrait-woman/800/1060",
  "https://picsum.photos/seed/brutalist-arch/800/1060",
];

async function main() {
  console.log("🌱 Seeding Limited Exposure databázi...");

  // ── Uživatelé ──────────────────────────────────────────
  const user1 = await prisma.user.upsert({
    where: { email: "elena.thorne@example.com" },
    update: {},
    create: { email: "elena.thorne@example.com", name: "Elena Thorne", role: "PHOTOGRAPHER" },
  });
  const user2 = await prisma.user.upsert({
    where: { email: "julian.vance@example.com" },
    update: {},
    create: { email: "julian.vance@example.com", name: "Julian Vance", role: "PHOTOGRAPHER" },
  });
  const user3 = await prisma.user.upsert({
    where: { email: "marta.novak@example.com" },
    update: {},
    create: { email: "marta.novak@example.com", name: "Marta Novák", role: "PHOTOGRAPHER" },
  });

  // ── Fotografické profily ───────────────────────────────
  await prisma.photographer.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      bio: "Elena Thorne je vizuální historička dokumentující průsečík brutalistické architektury a organického úpadku. Její práce byla popsána jako 'monograf ticha'.",
      instagram: "@elenathorne",
      totalSales: 142,
    },
  });
  const p2 = await prisma.photographer.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      bio: "Julian Vance tvoří v sérii. Každý projekt je roky trvající meditace na jedno téma — prázdnota, světlo, architektura paměti.",
      instagram: "@julianvance",
      totalSales: 287,
    },
  });
  const p3 = await prisma.photographer.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      bio: "Marta Novák pracuje na hranici dokumentu a fikce. Studovala na FAMU. Její tvorba zkoumá českou krajinu jako palimpsest kolektivní paměti.",
      instagram: "@martanovak.foto",
      totalSales: 63,
    },
  });

  // ── Rising Talents ─────────────────────────────────────
  const risingTalents = [
    { id: "rt-1", title: "Tichá ozvěna", description: "Zachyceno v dekommisionovaném průmyslovém objektu. Prázdnota jako dialog.", imageUrl: PHOTOS[0], format: "M" as const, photographerId: p3.id, price: 890000, totalCount: 50, soldCount: 12 },
    { id: "rt-2", title: "Mlžné vrcholy", description: "Ranní mlha pohlcuje hřebeny. Fotografie jako stav mysli.", imageUrl: PHOTOS[1], format: "L" as const, photographerId: p3.id, price: 1290000, totalCount: 30, soldCount: 7 },
    { id: "rt-3", title: "Symetrie víru", description: "Schodiště fotografováno přímo shora. Geometrie jako architektonická modlitba.", imageUrl: PHOTOS[2], format: "M" as const, photographerId: p3.id, price: 750000, totalCount: 50, soldCount: 23 },
  ];

  for (const w of risingTalents) {
    const photo = await prisma.photo.upsert({
      where: { id: w.id },
      update: {},
      create: { id: w.id, title: w.title, description: w.description, imageUrl: w.imageUrl, format: w.format, photographerId: w.photographerId },
    });
    const existing = await prisma.edition.findFirst({ where: { photoId: photo.id } });
    if (!existing) {
      await prisma.edition.create({
        data: { photoId: photo.id, type: "LIMITED_COUNT", price: w.price, totalCount: w.totalCount, soldCount: w.soldCount, tier: "RISING_TALENT" },
      });
    }
  }

  // ── Signature Series ───────────────────────────────────
  const signatureSeries = [
    { id: "ss-1", title: "Prázdnota hmoty", description: "Stěžejní kolekce Juliana Vance. Zkoumání ticha mezi atomy. Každý výtisk opatřen vlastnoručním podpisem fotografa.", imageUrl: PHOTOS[3], format: "L" as const, photographerId: p2.id, price: 18500000, availableUntil: new Date(Date.now() + 48 * 3_600_000) },
    { id: "ss-2", title: "Tichý výstup", description: "Fotografováno čtyři dny v brutalistickém observatoři. Vance čekal na světlo které eliminuje všechny spekulární odlesky.", imageUrl: PHOTOS[6], format: "L" as const, photographerId: p2.id, price: 32000000, availableUntil: new Date(Date.now() + 72 * 3_600_000) },
  ];

  for (const w of signatureSeries) {
    const photo = await prisma.photo.upsert({
      where: { id: w.id },
      update: {},
      create: { id: w.id, title: w.title, description: w.description, imageUrl: w.imageUrl, format: w.format, photographerId: w.photographerId },
    });
    const existing = await prisma.edition.findFirst({ where: { photoId: photo.id } });
    if (!existing) {
      await prisma.edition.create({
        data: { photoId: photo.id, type: "TIME_WINDOW", price: w.price, availableUntil: w.availableUntil, soldCount: 0, tier: "SIGNATURE" },
      });
    }
  }

  console.log("✅ Seed dokončen — 3 fotografové, 3 Rising Talents, 2 Signature Series");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
