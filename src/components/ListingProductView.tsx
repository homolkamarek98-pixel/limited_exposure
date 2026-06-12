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
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.1)",
  },
  BLACK: {
    padding: "14px",
    background: "#111111",
    boxShadow: "inset 0 1px 3px rgba(255,255,255,0.05)",
  },
  WHITE: {
    padding: "14px",
    background: "#f2f0ec",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.08)",
  },
};

// Pozadí za rámem — vždy barva stránky
const containerBg = "bg-[#faf6f0]";

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
              "relative flex items-center justify-center overflow-hidden group transition-all duration-500",
              containerBg,
              hasFrame ? "p-8 md:p-16" : "p-4 md:p-8",
            ].join(" ")}
            style={{ maxHeight: "72vh" }}
          >
            {/* Rám wrapper */}
            <div
              className="transition-all duration-500 inline-flex"
              style={frameStyle}
            >
              {/* Vnitřní mat (bílý passepartout) pro rámy */}
              {hasFrame ? (
                <div className="bg-white p-3 md:p-4 inline-flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="block max-h-[55vh] w-auto object-contain  transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="block max-h-[60vh] w-auto object-contain  transition-transform duration-700 group-hover:scale-[1.02]"
                />
              )}
            </div>

            {/* Frame label */}
            {hasFrame && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#faf6f0]/90 backdrop-blur-sm">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#57503f] whitespace-nowrap">
                  {selectedFrame === "OAK" ? "Přírodní dýhovaný dub" : selectedFrame === "BLACK" ? "Černý lakovaný hliník" : "Bílý lakovaný hliník"} · UV sklo
                </span>
              </div>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#faf6f0]/90 backdrop-blur-sm px-3 py-1.5 border border-[#e7dfd2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#1a1714]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span className="text-[9px] uppercase tracking-[0.2em]">Detail</span>
            </div>
          </div>
        </PhotoLightbox>

        {/* Format indicator */}
        <div className="border border-[#e7dfd2] p-1">
          <div className="aspect-[16/3] bg-[#f3ede3] flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170] text-center px-4">
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
