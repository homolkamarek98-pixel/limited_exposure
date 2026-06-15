// ───────────────────────────────────────────────────────────────
// Autoritativní ceník — JEDINÝ zdroj pravdy pro klienta i server.
// Ceny v haléřích. Server (createOrder) podle něj přepočítává cenu
// objednávky a NEVĚŘÍ částkám z košíku/klienta.
// ───────────────────────────────────────────────────────────────

export type Format = "S" | "M" | "L";
export type Frame = "NONE" | "OAK" | "BLACK" | "WHITE";
export type Carrier = "ZASILKOVNA" | "CZECH_POST" | "DPD" | "PPL" | "TOP_TRANS";

// Příplatek za rám dle formátu (haléře)
export const framePrices: Record<Frame, Record<Format, number>> = {
  NONE: { S: 0, M: 0, L: 0 },
  OAK: { S: 190000, M: 290000, L: 490000 },
  BLACK: { S: 149000, M: 199000, L: 349000 },
  WHITE: { S: 149000, M: 199000, L: 349000 },
};

// Cena dopravy dle dopravce (haléře)
export const shippingPrices: Record<Carrier, number> = {
  ZASILKOVNA: 7900,
  CZECH_POST: 9900,
  DPD: 12900,
  PPL: 12900,
  TOP_TRANS: 0,
};

type EditionPricing = { price: number; priceS: number | null; priceL: number | null };

// Základní cena tisku dle formátu (bez rámu)
export function basePriceForFormat(e: EditionPricing, format: Format): number {
  if (format === "S") return e.priceS ?? Math.round(e.price * 0.85);
  if (format === "L") return e.priceL ?? Math.round(e.price * 1.25);
  return e.price;
}

// Cena položky = základ dle formátu + příplatek za rám
export function computeItemPrice(e: EditionPricing, format: Format, frame: Frame): number {
  return basePriceForFormat(e, format) + (framePrices[frame]?.[format] ?? 0);
}

// editionId v košíku má tvar "uuid__S" — rozdělí na čisté id + formát
export function parseEditionId(raw: string): { id: string; format: Format } {
  const [id, fmt] = raw.split("__");
  const format: Format = fmt === "S" || fmt === "L" ? fmt : "M";
  return { id, format };
}

export function isCarrier(value: string): value is Carrier {
  return value in shippingPrices;
}

export function isFrame(value: string | undefined): value is Frame {
  return value === "NONE" || value === "OAK" || value === "BLACK" || value === "WHITE";
}
