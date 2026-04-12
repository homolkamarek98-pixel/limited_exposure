import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { EditionType, Tier } from "@/generated/prisma";

// GET /api/listings — seznam aktivních edic
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tierParam = searchParams.get("tier") as Tier | null;
  const typeParam = searchParams.get("type") as EditionType | null;

  const now = new Date();

  const editions = await prisma.edition.findMany({
    where: {
      ...(tierParam ? { tier: tierParam } : {}),
      ...(typeParam ? { type: typeParam } : {}),
      // Vyfiltruj vyprodané limited_count edice
      NOT: {
        AND: [
          { type: "LIMITED_COUNT" },
          { totalCount: { not: null } },
          // soldCount >= totalCount → vyprodáno
          // Prisma nepodporuje přímé porovnání dvou sloupců — řeší se raw query nebo fetchAll + filter
          // Pro teď vracíme vše a filtrujeme v aplikaci (optimalizovat pro Fázi 5)
        ],
      },
      // Vyfiltruj prošlé time_window edice
      OR: [
        { type: "LIMITED_COUNT" },
        { type: "TIME_WINDOW", availableUntil: { gt: now } },
      ],
    },
    include: {
      photo: {
        include: {
          photographer: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: { photo: { photographer: { totalSales: "desc" } } },
  });

  // Filtr vyprodaných limited_count edic v paměti (jednoduché pro MVP)
  const active = editions.filter((e) => {
    if (e.type === "LIMITED_COUNT" && e.totalCount !== null) {
      return e.soldCount < e.totalCount;
    }
    return true;
  });

  return NextResponse.json(active);
}

// POST /api/listings — vytvoření nové edice (photographer nebo admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !["PHOTOGRAPHER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    title: string;
    description?: string;
    imageUrl: string;
    format: "S" | "M" | "L";
    editionType: EditionType;
    price: number;
    totalCount?: number;
    availableUntil?: string;
    tier: Tier;
    photographerId?: string;
  };

  const {
    title, description, imageUrl, format,
    editionType, price, totalCount, availableUntil, tier,
  } = body;

  if (!title || !imageUrl || !format || !editionType || !price || !tier) {
    return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
  }

  if (editionType === "LIMITED_COUNT" && !totalCount) {
    return NextResponse.json(
      { error: "limited_count edice vyžaduje totalCount" },
      { status: 400 }
    );
  }

  if (editionType === "TIME_WINDOW" && !availableUntil) {
    return NextResponse.json(
      { error: "time_window edice vyžaduje availableUntil" },
      { status: 400 }
    );
  }

  const photographer = await prisma.photographer.findUnique({
    where: { userId: session.user.id },
  });

  if (!photographer && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Nemáš fotografický profil" },
      { status: 403 }
    );
  }

  const photographerId =
    session.user.role === "ADMIN"
      ? body.photographerId ?? photographer?.id
      : photographer!.id;

  if (!photographerId) {
    return NextResponse.json({ error: "Chybí photographerId" }, { status: 400 });
  }

  const edition = await prisma.edition.create({
    data: {
      photo: {
        create: {
          title,
          description: description ?? "",
          imageUrl,
          format,
          photographerId,
        },
      },
      type: editionType,
      price: Math.round(price),
      totalCount: editionType === "LIMITED_COUNT" ? totalCount : null,
      availableUntil: editionType === "TIME_WINDOW" ? new Date(availableUntil!) : null,
      tier,
    },
    include: {
      photo: {
        include: {
          photographer: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json(edition, { status: 201 });
}
