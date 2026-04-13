// Packeta (Zásilkovna) REST API — XML over HTTP
// Docs: https://docs.packeta.com / https://docs.packetery.com

const API_URL = "https://www.zasilkovna.cz/api/rest";

type CreatePacketParams = {
  orderNumber: string;       // interní číslo objednávky
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  // Výdejní místo (Zásilkovna pickup)
  addressId?: string;        // ID výdejního místa
  // Nebo domácí doručení
  street?: string;
  city?: string;
  zip?: string;
  country?: string;          // "CZ", "SK" …
  // Zásilka
  value: number;             // hodnota v Kč (celé číslo)
  weight?: number;           // váha v kg (default 0.5)
  cod?: number;              // dobírka v Kč (0 = bez dobírky)
};

export type CreatePacketResult =
  | { ok: true; barcode: string; id: string }
  | { ok: false; error: string };

function getCredentials() {
  const key = process.env.PACKETA_API_KEY;
  const password = process.env.PACKETA_API_PASSWORD;
  if (!key || !password) throw new Error("PACKETA_API_KEY nebo PACKETA_API_PASSWORD není nastaven");
  return { key, password };
}

export async function createPacket(params: CreatePacketParams): Promise<CreatePacketResult> {
  const { password } = getCredentials();

  const isHomeDelivery = !params.addressId;

  const addressXml = isHomeDelivery
    ? `
    <street>${escapeXml(params.street ?? "")}</street>
    <city>${escapeXml(params.city ?? "")}</city>
    <zip>${escapeXml(params.zip ?? "")}</zip>
    <country>${escapeXml(params.country ?? "CZ")}</country>`
    : `<addressId>${escapeXml(params.addressId!)}</addressId>`;

  const body = `<?xml version="1.0" encoding="utf-8"?>
<createPacket>
  <apiPassword>${escapeXml(password)}</apiPassword>
  <packetAttributes>
    <number>${escapeXml(params.orderNumber)}</number>
    <name>${escapeXml(params.firstName)}</name>
    <surname>${escapeXml(params.lastName)}</surname>
    <email>${escapeXml(params.email)}</email>
    ${params.phone ? `<phone>${escapeXml(params.phone)}</phone>` : ""}
    ${addressXml}
    <cod>${params.cod ?? 0}</cod>
    <value>${params.value}</value>
    <weight>${params.weight ?? 0.5}</weight>
    <eshop>LimitedExposure</eshop>
  </packetAttributes>
</createPacket>`;

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/xml; charset=utf-8" },
      body,
    });
  } catch (err) {
    return { ok: false, error: `Síťová chyba: ${String(err)}` };
  }

  const xml = await res.text();

  // Parse status
  const statusMatch = xml.match(/<status>([^<]+)<\/status>/);
  const status = statusMatch?.[1];

  if (status === "ok") {
    const barcodeMatch = xml.match(/<barcode>([^<]+)<\/barcode>/);
    const idMatch = xml.match(/<id>([^<]+)<\/id>/);
    return {
      ok: true,
      barcode: barcodeMatch?.[1] ?? "",
      id: idMatch?.[1] ?? "",
    };
  }

  // Chyba
  const faultStringMatch = xml.match(/<faultString>([^<]+)<\/faultString>/);
  const errorMatch = xml.match(/<message>([^<]+)<\/message>/);
  return {
    ok: false,
    error: faultStringMatch?.[1] ?? errorMatch?.[1] ?? `Neznámá chyba (HTTP ${res.status})`,
  };
}

export function getLabelUrl(barcode: string): string {
  const { key } = getCredentials();
  return `https://www.zasilkovna.cz/api/v1/${key}/label/${barcode}/format/A6`;
}

export function getTrackingUrl(barcode: string): string {
  return `https://www.zasilkovna.cz/zasilka/${barcode}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
