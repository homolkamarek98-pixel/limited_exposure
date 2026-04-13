"use client";

import { useState } from "react";
import { createPacketaShipment } from "@/lib/actions";

interface Props {
  orderId: string;
  hasPickupPoint: boolean;
}

export default function CreatePacketaButton({ orderId, hasPickupPoint }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    barcode?: string;
    trackingUrl?: string;
    labelUrl?: string;
    error?: string;
  } | null>(null);

  async function handleClick() {
    setLoading(true);
    setResult(null);
    try {
      const res = await createPacketaShipment(orderId);
      setResult(res as { barcode?: string; trackingUrl?: string; labelUrl?: string; error?: string });
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  if (result?.barcode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold text-green-800">✓ Zásilka vytvořena</p>
        <p className="text-xs text-green-700 font-mono">Barcode: {result.barcode}</p>
        <div className="flex gap-3">
          <a
            href={result.labelUrl}
            target="_blank"
            rel="noopener"
            className="inline-block bg-black text-white px-4 py-2 text-xs font-medium rounded hover:opacity-80"
          >
            Tisk štítku (A6) →
          </a>
          <a
            href={result.trackingUrl}
            target="_blank"
            rel="noopener"
            className="inline-block border border-black px-4 py-2 text-xs font-medium rounded hover:bg-black hover:text-white transition-colors"
          >
            Sledovat zásilku →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!hasPickupPoint && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
          Zákazník nezvolil výdejní místo — zásilka bude doručena na adresu.
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 bg-[#e63228] text-white px-5 py-2.5 text-sm font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Vytváří se…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Vytvořit zásilku v Zásilkovně
          </>
        )}
      </button>
      {result?.error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
          Chyba: {result.error}
        </p>
      )}
    </div>
  );
}
