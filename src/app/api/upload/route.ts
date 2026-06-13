import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/upload — upload fotografie do Cloudflare R2
// Fáze 2: placeholder — R2 se zapojí ve Fázi 3 po nastavení credentials
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !["PHOTOGRAPHER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ověř že R2 je nakonfigurované
  const r2Configured =
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME;

  if (!r2Configured) {
    return NextResponse.json(
      {
        error: "R2 storage není nakonfigurované",
        hint: "Nastav R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME v .env.local",
      },
      { status: 503 }
    );
  }

  // TODO (Fáze 3): implementace R2 upload přes @aws-sdk/client-s3
  // 1. Přečíst FormData — req.formData()
  // 2. Validovat typ (image/jpeg, image/png, image/webp) a velikost (max 50MB)
  // 3. Vygenerovat unikátní klíč: `photos/{userId}/{uuid}.{ext}`
  // 4. Upload do R2 přes PutObjectCommand
  // 5. Vrátit { url: `${R2_PUBLIC_URL}/${key}` }

  return NextResponse.json(
    { error: "Upload není implementován — čeká na Fázi 3 (R2 credentials)" },
    { status: 501 }
  );
}
