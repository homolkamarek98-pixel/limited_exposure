"use client";

import { useState } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";
import ListingSidebar, { type Frame } from "@/components/ListingSidebar";

// CSS pro každý typ rámu — inline styles + Tailwind
const frameStyles: Record<Frame, React.CSSProperties> = {
  NONE: {},
  OAK: {
    padding: "18px",
    background: "linear-gradient(135deg, #c9943c 0%, #8b5e1e 25%, #c4903a 50%, #7a5218 75%, #be8c38 100%)",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.1), 2px 4px 16px rgba(0,0,0,0.25)",
  },
  BLACK: {
    padding: "14px",
    background: "#111111",
    boxShadow: "inset 0 1px 3px rgba(255,255,255,0.05), 2px 4px 16px rgba(0,0,0,0.35)",
  },
  WHITE: {
    padding: "14px",
    background: "#f2f0ec",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.08), 2px 4px 16px rgba(0,0,0,0.15)",
  },
};

// Outer mat board barva (pod rámem)
const containerBg: Record<Frame, string> = {
  NONE: "bg-surface-container-highest",
  OAK:  "bg-[#2a2015]",
  BLACK: "bg-[#0a0a0a]",
  WHITE: "bg-[#dbd9d5]",
};

interface Props {
  imageUrl: string;
  imageAlt: string;
  photoFormat: "S" | "M" | "L";
  edition: {
    id: string;
    price: number;
    priceS: number | null;
    priceL: number | null;
    type: "LIMITED_COUNT" | "TIME_WINDOW";
    totalCount: number | null;
    soldCount: number;
    availableUntil: string | null;
    tier: "RISING_TALENT" | "SIGNATURE";
  };
  photographer: { id: string; name: string };
  isSignature: boolean;
  soldOut: boolean;
  expired: boolean;
  takenNumbers: number[];
}

export default function ListingProductView({
  imageUrl,
  imageAlt,
  photoFormat,
  edition,
  photographer,
  isSignature,
  soldOut,
  expired,
  takenNumbers,
}: Props) {
  const [selectedFrame, setSelectedFrame] = useState<Frame>("NONE");

  const frameStyle = frameStyles[selectedFrame];
  const hasFrame = selectedFrame !== "NONE";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">

      {/* Fotografie s frame preview */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <PhotoLightbox src={imageUrl} alt={imageAlt}>
          <div
            className={[
              "relative aspect-[4/5] overflow-hidden group transition-all duration-500",
              containerBg[selectedFrame],
              hasFrame ? "p-6 md:p-12" : "p-4 md:p-10",
            ].join(" ")}
          >
            {/* Rám wrapper */}
            <div
              className="w-full h-full transition-all duration-500"
              style={frameStyle}
            >
              {/* Vnitřní mat (bílý passepartout) pro rámy */}
              {hasFrame && (
                <div className="w-full h-full bg-white p-3 md:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              {!hasFrame && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>

            {/* Frame label overlay */}
            {hasFrame && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm">
                <span className="font-label text-[9px] uppercase tracking-widest text-white/70">
                  {selectedFrame === "OAK" ? "Přírodní dýhovaný dub" : selectedFrame === "BLACK" ? "Černý lakovaný hliník" : "Bílý lakovaný hliník"} · UV sklo
                </span>
              </div>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 le-glass px-4 py-2 border border-outline/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span className="font-label text-[10px] uppercase tracking-widest font-bold">Prohlédnout detail</span>
            </div>
          </div>
        </PhotoLightbox>

        {/* Format indicator */}
        <div className="outline outline-1 outline-outline-variant/20 p-1">
          <div className="aspect-[16/3] bg-surface-container-low flex items-center justify-center">
            <span className="font-label text-[10px] uppercase tracking-widest text-outline">
              Tisk na Hahnemühle Photo Rag Baryta · {photoFormat === "S" ? "30 × 40" : photoFormat === "M" ? "50 × 70" : "70 × 100"} cm
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col gap-10">
        <ListingSidebar
          edition={edition}
          photo={{ title: imageAlt, imageUrl, format: photoFormat }}
          photographer={photographer}
          isSignature={isSignature}
          soldOut={soldOut}
          expired={expired}
          takenNumbers={takenNumbers}
          selectedFrame={selectedFrame}
          onFrameChange={setSelectedFrame}
        />
      </aside>
    </div>
  );
}
