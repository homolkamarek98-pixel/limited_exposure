import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID!;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mimeType] ?? "jpg";
}

// POST /api/upload — upload fotografie do Cloudflare R2
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !["PHOTOGRAPHER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Neplatná FormData" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Pole 'file' chybí nebo není soubor" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Nepodporovaný typ souboru: ${file.type}. Povoleno: JPEG, PNG, WebP` },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Soubor je příliš velký (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum je 50 MB.` },
      { status: 413 }
    );
  }

  const ext = getExtension(file.type);
  const key = `photos/${session.user.id}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const client = getR2Client();
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: buffer.length,
      })
    );
  } catch (err) {
    console.error("R2 upload error:", err);
    return NextResponse.json({ error: "Upload do R2 selhal" }, { status: 502 });
  }

  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  const url = publicBase ? `${publicBase}/${key}` : null;

  return NextResponse.json({ url, key }, { status: 200 });
}
