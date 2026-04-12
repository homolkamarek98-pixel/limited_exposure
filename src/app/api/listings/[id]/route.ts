import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/listings/[id] — detail edice s plnými daty
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const edition = await prisma.edition.findUnique({
    where: { id },
    include: {
      photo: {
        include: {
          photographer: {
            include: {
              user: { select: { id: true, name: true } },
              photos: {
                // Ostatní práce fotografa (max 6)
                take: 6,
                include: {
                  editions: {
                    take: 1,
                    orderBy: { soldCount: "desc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!edition) {
    return NextResponse.json({ error: "Edice nenalezena" }, { status: 404 });
  }

  return NextResponse.json(edition);
}
