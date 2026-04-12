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

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={[
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#e8e8e8]">
          <span className="font-label text-xs uppercase tracking-widest font-bold">
            Košík ({items.length})
          </span>
          <button
            onClick={onClose}
            className="font-label text-xs text-[#777] hover:text-black transition-colors"
          >
            ✕ Zavřít
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sm text-[#777]">Košík je prázdný</p>
              <Link
                href="/gallery"
                onClick={onClose}
                className="inline-block mt-6 font-label text-[10px] uppercase tracking-widest border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
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
                  className="w-20 h-20 object-cover shrink-0 grayscale"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-headline text-sm font-bold uppercase tracking-tight leading-tight line-clamp-2">
                    {item.photoTitle}
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-[#777] mt-1">
                    {item.photographerName}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-headline text-sm font-bold">{formatPrice(item.price)}</span>
                    <button
                      onClick={() => removeItem(item.editionId)}
                      className="font-label text-[10px] uppercase tracking-widest text-[#999] hover:text-red-600 transition-colors"
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
          <div className="px-8 py-6 border-t border-[#e8e8e8] space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-label text-xs uppercase tracking-widest text-[#777]">Celkem</span>
              <span className="font-headline text-xl font-black">{formatPrice(totalAmount())}</span>
            </div>
            <p className="font-label text-[10px] text-[#aaa] uppercase tracking-widest">
              Doprava bude vypočtena při pokladně
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-black text-white text-center font-label text-[10px] uppercase tracking-widest py-4 hover:opacity-80 transition-opacity"
            >
              Přejít k pokladně →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
