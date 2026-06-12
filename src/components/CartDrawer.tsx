"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useState, useEffect } from "react";

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(halers / 100);
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, totalAmount } = useCart();
  const [mounted, setMounted] = useState(false);

  // SSR hydratační guard — localStorage košík existuje jen na klientu
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-[#1a1714]/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={[
          "fixed top-0 right-0 h-full w-full max-w-md bg-[#faf6f0] z-50 border-l border-[#e7dfd2] flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#e7dfd2]">
          <span className="font-label text-xs uppercase tracking-[0.18em] font-bold">
            Košík ({items.length})
          </span>
          <button
            onClick={onClose}
            className="font-label text-xs text-[#8a8170] hover:text-[#1a1714] transition-colors"
          >
            ✕ Zavřít
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sm text-[#8a8170]">Košík je prázdný</p>
              <Link
                href="/gallery"
                onClick={onClose}
                className="inline-block mt-6 font-label text-[10px] uppercase tracking-[0.18em] border border-[#1a1714] px-6 py-3 hover:bg-[#1a1714] hover:text-[#faf6f0] transition-colors"
              >
                Prohlédnout galerii
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.editionId} className="flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.photoTitle}
                  className="w-20 h-20 object-cover shrink-0 "
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium tracking-[-0.01em] leading-tight line-clamp-2">
                    {item.photoTitle}
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-[0.18em] text-[#8a8170] mt-1">
                    {item.photographerName}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="otisk-mono text-sm">{formatPrice(item.price)}</span>
                    <button
                      onClick={() => removeItem(item.editionId)}
                      className="font-label text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#b2401c] transition-colors"
                    >
                      Odebrat
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-[#e7dfd2] space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-label text-xs uppercase tracking-[0.18em] text-[#8a8170]">Celkem</span>
              <span className="otisk-mono text-xl font-medium">{formatPrice(totalAmount())}</span>
            </div>
            <p className="font-label text-[10px] text-[#c4bba9] uppercase tracking-[0.18em]">
              Doprava bude vypočtena při pokladně
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-[#1a1714] text-[#faf6f0] text-center font-label text-[10px] uppercase tracking-[0.18em] py-4 hover:bg-[#57503f] transition-colors"
            >
              Přejít k pokladně →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
