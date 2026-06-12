"use client";

import { useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import EditionBadge from "@/components/EditionBadge";
import { useCart } from "@/lib/cart";

export type Format = "S" | "M" | "L";
export type Frame = "NONE" | "OAK" | "BLACK" | "WHITE";

const formatLabels: Record<Format, string> = {
  S: "Small — 30 × 40 cm",
  M: "Medium — 50 × 70 cm",
  L: "Large — 70 × 100 cm",
};

// Ceny rámů v haléřích dle formátu
const framePrices: Record<Frame, Record<Format, number>> = {
  NONE:  { S: 0,      M: 0,      L: 0 },
  OAK:   { S: 190000, M: 290000, L: 490000 },
  BLACK: { S: 149000, M: 199000, L: 349000 },
  WHITE: { S: 149000, M: 199000, L: 349000 },
};

const frameOptions: { key: Frame; label: string; swatch: string; desc: string }[] = [
  { key: "NONE",  label: "Bez rámu",    swatch: "",        desc: "Pouze tisk" },
  { key: "OAK",   label: "Dubový rám",  swatch: "#b5813a", desc: "Přírodní dub + UV sklo" },
  { key: "BLACK", label: "Černý rám",   swatch: "#1a1a1a", desc: "Černý lakovaný hliník + UV sklo" },
  { key: "WHITE", label: "Bílý rám",    swatch: "#f0efec", desc: "Bílý lakovaný hliník + UV sklo" },
];

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
  selectedFrame: Frame;
  onFrameChange: (frame: Frame) => void;
}

export default function ListingSidebar({
  edition,
  photo,
  photographer,
  isSignature,
  soldOut,
  expired,
  takenNumbers,
  selectedFrame,
  onFrameChange,
}: Props) {
  const [selectedFormat, setSelectedFormat] = useState<Format>(photo.format);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const { addItem } = useCart();

  // Použij admin-nastavenou cenu, fallback na procentní koeficient
  const basePrices: Record<Format, number> = {
    S: edition.priceS ?? Math.round(edition.price * 0.85),
    M: edition.price,
    L: edition.priceL ?? Math.round(edition.price * 1.25),
  };

  const frameAddon = framePrices[selectedFrame][selectedFormat];
  const currentPrice = basePrices[selectedFormat] + frameAddon;

  // availableUntil je ISO string ze serveru
  const availableUntilDate = edition.availableUntil ? new Date(edition.availableUntil) : null;

  return (
    <>
      {/* Breadcrumb + title */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170] mb-4 flex items-center gap-2">
          <span>{isSignature ? "Signature Series" : "Rising Talents"}</span>
          <span className="h-px w-8 bg-[#e7dfd2] inline-block" />
        </span>
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714] mb-2">
          {photo.title}
        </h1>
        <Link
          href={`/photographer/${photographer.id}`}
          className="text-lg text-[#57503f] hover:text-[#1a1714] transition-colors"
        >
          od {photographer.name}
        </Link>
      </div>

      {/* Price + edition badge */}
      <div className="flex items-baseline justify-between py-6 border-t border-[#e7dfd2]">
        <span className="otisk-mono text-3xl font-medium text-[#1a1714]">
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
        <div className="pb-6 border-b border-[#e7dfd2] -mt-2">
          {(() => {
            const remaining = edition.totalCount - edition.soldCount;
            const pct = Math.min(100, Math.round((edition.soldCount / edition.totalCount) * 100));
            const urgent = remaining <= Math.ceil(edition.totalCount * 0.2);
            return (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className={["otisk-mono text-[10px] uppercase tracking-[0.18em]", urgent ? "text-[#b2401c]" : "text-[#8a8170]"].join(" ")}>
                    {soldOut ? "Vyprodáno" : urgent ? `Zbývá pouze ${remaining} ${remaining === 1 ? "kus" : remaining < 5 ? "kusy" : "kusů"}` : `Zbývá ${remaining} z ${edition.totalCount}`}
                  </span>
                  <span className="otisk-mono text-[10px] text-[#8a8170]">{pct} % prodáno</span>
                </div>
                <div className="h-0.5 bg-[#e7dfd2] w-full overflow-hidden">
                  <div
                    className={["h-full transition-all duration-500", urgent ? "bg-[#b2401c]" : "bg-[#1a1714]"].join(" ")}
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
        <div className="pb-6 border-b border-[#e7dfd2] -mt-2">
          {(() => {
            // Čas se počítá při renderu, ne reaktivně
            // eslint-disable-next-line react-hooks/purity
            const msLeft = availableUntilDate.getTime() - Date.now();
            if (msLeft <= 0 || expired) {
              return (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#b2401c]">Edice uzavřena</span>
                  </div>
                  <div className="h-0.5 bg-[#e7dfd2] w-full" />
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
                  <span className={["otisk-mono text-[10px] uppercase tracking-[0.18em]", urgent ? "text-[#b2401c]" : "text-[#8a8170]"].join(" ")}>
                    {label}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170]">časová edice</span>
                </div>
                <div className="h-0.5 bg-[#e7dfd2] w-full overflow-hidden">
                  <div
                    className={["h-full transition-all duration-500", urgent ? "bg-[#b2401c]" : "bg-[#1a1714]"].join(" ")}
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
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170] mb-3 block">
          Formát tisku
        </span>
        <div className="flex flex-col gap-2">
          {(["S", "M", "L"] as Format[]).map((f) => {
            const active = selectedFormat === f;
            const p = basePrices[f];
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
                  "flex items-center justify-between px-4 py-4 border text-left transition-all duration-150 w-full",
                  active
                    ? "border-[#1a1714] bg-[#1a1714] text-[#faf6f0]"
                    : "border-[#e7dfd2] bg-transparent text-[#1a1714] hover:border-[#1a1714]",
                ].join(" ")}
              >
                <span className="text-[10px] uppercase tracking-[0.18em]">
                  {formatLabels[f]}
                </span>
                <span className={["otisk-mono text-xs shrink-0 ml-4", active ? "text-[#faf6f0]/70" : "text-[#8a8170]"].join(" ")}>
                  {diffLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame selector */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170] mb-3 block">
          Rám a zasklení
        </span>
        <div className="flex flex-col gap-2 mb-3">
          {frameOptions.map(({ key, label, swatch, desc }) => {
            const active = selectedFrame === key;
            const addon = framePrices[key][selectedFormat];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onFrameChange(key)}
                className={[
                  "flex items-center gap-3 px-4 py-3.5 border text-left transition-all duration-150 w-full",
                  active
                    ? "border-[#1a1714] bg-[#1a1714] text-[#faf6f0]"
                    : "border-[#e7dfd2] bg-transparent text-[#1a1714] hover:border-[#1a1714]",
                ].join(" ")}
              >
                {/* Swatch */}
                {key === "NONE" ? (
                  <span className={["w-4 h-4 shrink-0 border flex items-center justify-center", active ? "border-[#faf6f0]/30" : "border-[#c4bba9]"].join(" ")}>
                    <svg width="8" height="8" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5">
                      <line x1="0" y1="0" x2="10" y2="10" />
                    </svg>
                  </span>
                ) : (
                  <span
                    className="w-4 h-4 shrink-0 border border-[#1a1714]/10"
                    style={{ backgroundColor: swatch }}
                  />
                )}
                <span className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.18em] block leading-none mb-0.5">{label}</span>
                  <span className={["text-[9px] uppercase tracking-[0.12em]", active ? "text-[#faf6f0]/50" : "text-[#8a8170]"].join(" ")}>{desc}</span>
                </span>
                <span className={["otisk-mono text-xs shrink-0 ml-2", active ? "text-[#faf6f0]/70" : "text-[#8a8170]"].join(" ")}>
                  {addon === 0 ? "V ceně" : `+${formatPrice(addon)}`}
                </span>
              </button>
            );
          })}
        </div>
        {selectedFrame !== "NONE" && (
          <div className="bg-[#f3ede3] border border-[#e7dfd2] px-4 py-3 space-y-1">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#57503f] leading-relaxed">
              Sklo s vysokým UV filtrem · Chrání pigmenty před vyblednutím · Černá zůstává černá · Barvy zůstávají živé
            </p>
          </div>
        )}
      </div>

      {/* Number picker — pouze pro LIMITED_COUNT edice */}
      {edition.type === "LIMITED_COUNT" && edition.totalCount !== null && edition.totalCount > 0 && !soldOut && (
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">
              Vyberte číslo tisku
            </span>
            {selectedNumber !== null && (
              <span className="otisk-mono text-[10px] text-[#57503f]">
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
                    "aspect-square flex items-center justify-center text-[10px] otisk-mono border transition-all",
                    taken
                      ? "border-[#e7dfd2] text-[#c4bba9] cursor-not-allowed bg-[#f3ede3]"
                      : selected
                      ? "border-[#1a1714] bg-[#1a1714] text-[#faf6f0]"
                      : "border-[#e7dfd2] text-[#57503f] hover:border-[#1a1714] hover:bg-[#1a1714] hover:text-[#faf6f0]",
                  ].join(" ")}
                >
                  {n}
                </button>
              );
            })}
          </div>
          {selectedNumber === null && (
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a8170] mt-2">
              Nekliknete-li, přiřadíme nejnižší dostupné číslo.
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <AddToCartButton
        item={{
          editionId: `${edition.id}__${selectedFormat}`,
          photoTitle: `${photo.title} (${selectedFormat})${selectedFrame !== "NONE" ? ` + ${frameOptions.find(f => f.key === selectedFrame)?.label}` : ""}`,
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
      <div className="flex items-center gap-3 text-[#8a8170]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span className="text-[10px] uppercase tracking-[0.18em]">
          Pojištěná světová doprava v ceně
        </span>
      </div>
    </>
  );
}
