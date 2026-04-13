"use client";

import { useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import EditionBadge from "@/components/EditionBadge";
import { useCart } from "@/lib/cart";

type Format = "S" | "M" | "L";

const formatLabels: Record<Format, string> = {
  S: "Small — 30 × 40 cm",
  M: "Medium — 50 × 70 cm",
  L: "Large — 70 × 100 cm",
};

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(halers / 100);
}

interface Props {
  edition: {
    id: string;
    price: number;      // M cena (základ)
    priceS: number | null;
    priceL: number | null;
    type: "LIMITED_COUNT" | "TIME_WINDOW";
    totalCount: number | null;
    soldCount: number;
    availableUntil: string | null; // ISO string — ne Date (serializace server→client)
    tier: "RISING_TALENT" | "SIGNATURE";
  };
  photo: {
    title: string;
    imageUrl: string;
    format: Format;
  };
  photographer: {
    id: string;
    name: string;
  };
  isSignature: boolean;
  soldOut: boolean;
  expired: boolean;
  takenNumbers: number[];
}

export default function ListingSidebar({
  edition,
  photo,
  photographer,
  isSignature,
  soldOut,
  expired,
  takenNumbers,
}: Props) {
  const [selectedFormat, setSelectedFormat] = useState<Format>(photo.format);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const { addItem } = useCart();

  // Použij admin-nastavenou cenu, fallback na procentní koeficient
  const prices: Record<Format, number> = {
    S: edition.priceS ?? Math.round(edition.price * 0.85),
    M: edition.price,
    L: edition.priceL ?? Math.round(edition.price * 1.25),
  };

  const currentPrice = prices[selectedFormat];

  // availableUntil je ISO string ze serveru
  const availableUntilDate = edition.availableUntil ? new Date(edition.availableUntil) : null;

  return (
    <>
      {/* Breadcrumb + title */}
      <div>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4 flex items-center gap-2">
          <span>{isSignature ? "Signature Series" : "Rising Talents"}</span>
          <span className="h-px w-8 bg-outline-variant inline-block" />
        </span>
        <h1 className="serif-display text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-2">
          {photo.title}
        </h1>
        <Link
          href={`/photographer/${photographer.id}`}
          className="font-body text-lg font-medium text-tertiary hover:text-primary transition-colors"
        >
          od {photographer.name}
        </Link>
      </div>

      {/* Price + edition badge */}
      <div className="flex items-baseline justify-between py-6 border-t border-outline-variant/20">
        <span className="serif-display text-3xl font-bold">
          {formatPrice(currentPrice)}
        </span>
        <EditionBadge
          type={edition.type}
          totalCount={edition.totalCount}
          soldCount={edition.soldCount}
          availableUntil={availableUntilDate}
          variant="detail"
        />
      </div>

      {/* Progress bar — LIMITED_COUNT: zbývá X z Y */}
      {edition.type === "LIMITED_COUNT" && edition.totalCount !== null && (
        <div className="pb-6 border-b border-outline-variant/20 -mt-2">
          {(() => {
            const remaining = edition.totalCount - edition.soldCount;
            const pct = Math.min(100, Math.round((edition.soldCount / edition.totalCount) * 100));
            const urgent = remaining <= Math.ceil(edition.totalCount * 0.2);
            return (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className={["font-label text-[10px] uppercase tracking-widest font-bold", urgent ? "text-red-600" : "text-outline"].join(" ")}>
                    {soldOut ? "Vyprodáno" : urgent ? `Zbývá pouze ${remaining} ${remaining === 1 ? "kus" : remaining < 5 ? "kusy" : "kusů"}` : `Zbývá ${remaining} z ${edition.totalCount}`}
                  </span>
                  <span className="font-label text-[10px] text-outline">{pct} % prodáno</span>
                </div>
                <div className="h-1 bg-outline-variant/20 w-full overflow-hidden">
                  <div
                    className={["h-full transition-all duration-500", urgent ? "bg-red-500" : "bg-primary"].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Progress bar — TIME_WINDOW: zbývá čas */}
      {edition.type === "TIME_WINDOW" && availableUntilDate && (
        <div className="pb-6 border-b border-outline-variant/20 -mt-2">
          {(() => {
            const msLeft = availableUntilDate.getTime() - Date.now();
            if (msLeft <= 0 || expired) {
              return (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-label text-[10px] uppercase tracking-widest font-bold text-red-600">Edice uzavřena</span>
                  </div>
                  <div className="h-1 bg-outline-variant/20 w-full" />
                </>
              );
            }
            const hoursLeft = msLeft / (1000 * 3600);
            const urgent = hoursLeft < 24;
            const pct = Math.max(0, Math.min(100, Math.round((msLeft / (7 * 24 * 3600 * 1000)) * 100)));
            const label = hoursLeft < 1
              ? `Zbývá ${Math.floor(msLeft / 60000)} min`
              : hoursLeft < 48
              ? `Zbývá ${Math.round(hoursLeft)} hodin`
              : `Zbývá ${Math.floor(hoursLeft / 24)} ${Math.floor(hoursLeft / 24) === 1 ? "den" : Math.floor(hoursLeft / 24) < 5 ? "dny" : "dní"}`;
            return (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className={["font-label text-[10px] uppercase tracking-widest font-bold", urgent ? "text-red-600" : "text-outline"].join(" ")}>
                    {label}
                  </span>
                  <span className="font-label text-[10px] text-outline">časová edice</span>
                </div>
                <div className="h-1 bg-outline-variant/20 w-full overflow-hidden">
                  <div
                    className={["h-full transition-all duration-500", urgent ? "bg-red-500" : "bg-primary"].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Format selector */}
      <div>
        <span className="font-label text-[10px] uppercase tracking-widest font-bold mb-3 block">
          Formát tisku
        </span>
        <div className="flex flex-col gap-2">
          {(["S", "M", "L"] as Format[]).map((f) => {
            const active = selectedFormat === f;
            const p = prices[f];
            const diff = p - edition.price;
            const diffLabel =
              diff === 0
                ? "Výchozí"
                : diff > 0
                ? `+${formatPrice(diff)}`
                : `−${formatPrice(Math.abs(diff))}`;

            return (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFormat(f)}
                className={[
                  "flex items-center justify-between px-4 py-4 border-2 text-left transition-all duration-150 w-full",
                  active
                    ? "border-black bg-black text-white"
                    : "border-[#e0e0e0] bg-white text-black hover:border-black",
                ].join(" ")}
              >
                <span className="font-label text-xs uppercase tracking-wider font-bold">
                  {formatLabels[f]}
                </span>
                <span className={["font-label text-xs shrink-0 ml-4", active ? "text-white/70" : "text-[#777]"].join(" ")}>
                  {diffLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number picker — pouze pro LIMITED_COUNT edice */}
      {edition.type === "LIMITED_COUNT" && edition.totalCount !== null && edition.totalCount > 0 && !soldOut && (
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="font-label text-[10px] uppercase tracking-widest font-bold">
              Vyberte číslo tisku
            </span>
            {selectedNumber !== null && (
              <span className="font-label text-[10px] text-outline">
                Číslo {String(selectedNumber).padStart(3, "0")}/{edition.totalCount} vybráno
              </span>
            )}
          </div>
          <div
            className="grid gap-1.5 overflow-y-auto max-h-48 pr-1"
            style={{ gridTemplateColumns: `repeat(${edition.totalCount <= 30 ? 6 : 8}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: edition.totalCount }, (_, i) => i + 1).map((n) => {
              const taken = takenNumbers.includes(n);
              const selected = selectedNumber === n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={taken}
                  onClick={() => setSelectedNumber(selected ? null : n)}
                  title={taken ? `Číslo ${n} je obsazeno` : `Vybrat číslo ${n}`}
                  className={[
                    "aspect-square flex items-center justify-center text-[10px] font-label font-bold border transition-all",
                    taken
                      ? "border-[#e8e8e8] text-[#ccc] cursor-not-allowed bg-[#f9f9f9]"
                      : selected
                      ? "border-black bg-black text-white"
                      : "border-[#e0e0e0] text-[#474747] hover:border-black hover:bg-black hover:text-white",
                  ].join(" ")}
                >
                  {n}
                </button>
              );
            })}
          </div>
          {selectedNumber === null && (
            <p className="font-label text-[9px] uppercase tracking-widest text-outline mt-2">
              Nekliknete-li, přiřadíme nejnižší dostupné číslo.
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <AddToCartButton
        item={{
          editionId: `${edition.id}__${selectedFormat}`,
          photoTitle: `${photo.title} (${selectedFormat})`,
          photographerName: photographer.name,
          imageUrl: photo.imageUrl,
          price: currentPrice,
          tier: edition.tier,
          requestedNumber: selectedNumber ?? undefined,
        }}
        soldOut={soldOut}
        expired={expired}
      />

      {/* Shipping note */}
      <div className="flex items-center gap-3 text-outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span className="font-label text-[10px] uppercase tracking-widest">
          Pojištěná světová doprava v ceně
        </span>
      </div>
    </>
  );
}
