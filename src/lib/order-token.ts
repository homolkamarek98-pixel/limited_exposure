import { createHmac } from "crypto";

// Bezstavový přístupový token k objednávce (HMAC z orderId).
// Nevyžaduje žádný sloupec v DB — odvozený z NEXTAUTH_SECRET.
// Slouží k bezpečnému zobrazení potvrzení objednávky hostům (bez přihlášení),
// aniž by šlo cizí objednávku zobrazit uhádnutím/enumerací id (IDOR).
export function orderToken(orderId: string): string {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "insecure-dev-secret";
  return createHmac("sha256", secret).update(orderId).digest("hex").slice(0, 32);
}
