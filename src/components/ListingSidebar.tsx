"use client";

import { useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import EditionBadge from "@/components/EditionBadge";

type Format = "S" | "M" | "L";

const formatLabels: Record<Format, string> = {
  S: "Small — 30 × 40 cm",
  M: "Medium — 50 × 70 cm",
  L: "Large — 70 × 100 cm",
};

// S = -15 %, M = základ, L = +25 %
const formatMultiplier: Record<Format, number> = {
  S: 0.85,
  M: 1,
  L: 1.25,
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
    price: number;
    type: "LIMITED_COUNT" | "TIME_WINDOW";
    totalCount: number | null;
    soldCount: number;
    availableUntil: Date | null;
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
}

export default function ListingSidebar({
  edition,
  photo,
  photographer,
  isSignature,
  soldOut,
  expired,
}: Props) {
  const [selectedFormat, setSelectedFormat] = useState<Format>(photo.format);

  const price = Math.round(edition.price * formatMultiplier[selectedFormat]);

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
      <div className="flex items-baseline justify-between py-6 border-y border-outline-variant/20">
        <span className="serif-display text-3xl font-bold transition-all duration-200">
          {formatPrice(price)}
        </span>
        <EditionBadge
          type={edition.type}
          totalCount={edition.totalCount}
          soldCount={edition.soldCount}
          availableUntil={edition.availableUntil}
          variant="detail"
        />
      </div>

      {/* Format selector */}
      <div>
        <span className="font-label text-[10px] uppercase tracking-widest font-bold mb-4 block">
          Formát tisku
        </span>
        <div className="flex flex-col gap-2">
          {(["S", "M", "L"] as Format[]).map((f) => {
            const active = selectedFormat === f;
            const isDefault = photo.format === f;
            const mult = formatMultiplier[f];
            const diffLabel =
              mult === 1
                ? "Výchozí"
                : mult > 1
                ? `+${Math.round((mult - 1) * 100)} %`
                : `−${Math.round((1 - mult) * 100)} %`;

            return (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFormat(f)}
                className={[
                  "flex items-center justify-between p-4 border text-left transition-colors w-full",
                  active
                    ? "border-black bg-[#fafafa]"
                    : "border-outline-variant/30 hover:border-black",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      active ? "border-black" : "border-[#ccc]",
                    ].join(" ")}
                  >
                    {active && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <span className="font-label text-xs uppercase tracking-tight">
                    {formatLabels[f]}
                  </span>
                </div>
                <span
                  className={[
                    "font-label text-xs shrink-0",
                    isDefault ? "text-outline" : mult > 1 ? "text-black" : "text-green-700",
                  ].join(" ")}
                >
                  {diffLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <AddToCartButton
        item={{
          editionId: `${edition.id}__${selectedFormat}`,
          photoTitle: `${photo.title} (${selectedFormat})`,
          photographerName: photographer.name,
          imageUrl: photo.imageUrl,
          price,
          tier: edition.tier,
        }}
        soldOut={soldOut}
        expired={expired}
      />

      {/* Shipping note */}
      <div className="flex items-center gap-3 text-outline">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
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
