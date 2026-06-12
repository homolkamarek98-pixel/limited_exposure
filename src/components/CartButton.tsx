"use client";

import { useCart } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import { useState, useEffect } from "react";

export default function CartButton() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // SSR hydratační guard — localStorage košík existuje jen na klientu
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative text-xs uppercase tracking-[0.18em] text-[#57503f] hover:text-[#1a1714] transition-colors"
      >
        Košík
        {items.length > 0 && (
          <span className="otisk-mono absolute -top-2 -right-4 bg-[#1a1714] text-[#faf6f0] text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
