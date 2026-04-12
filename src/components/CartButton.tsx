"use client";

import { useCart } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import { useState, useEffect } from "react";

export default function CartButton() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative font-label text-xs uppercase tracking-widest text-[#474747] hover:text-black transition-colors"
      >
        Košík
        {items.length > 0 && (
          <span className="absolute -top-2 -right-4 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {items.length}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
