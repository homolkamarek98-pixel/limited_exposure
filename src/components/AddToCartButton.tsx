"use client";

import { useCart, CartItem } from "@/lib/cart";
import { useState } from "react";

interface Props {
  item: CartItem;
  soldOut: boolean;
  expired: boolean;
}

export default function AddToCartButton({ item, soldOut, expired }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.some((i) => i.editionId === item.editionId);
  const unavailable = soldOut || expired;

  if (unavailable) {
    return (
      <div className="w-full bg-surface-container py-5 px-12 font-label text-xs uppercase tracking-[0.2em] font-bold text-outline text-center border border-outline-variant/30">
        {soldOut ? "Edice vyprodána" : "Edice vypršela"}
      </div>
    );
  }

  if (inCart || added) {
    return (
      <div className="w-full bg-black text-white py-5 px-12 font-label text-xs uppercase tracking-[0.2em] font-bold text-center">
        ✓ Přidáno do košíku
      </div>
    );
  }

  function handleClick() {
    addItem(item);
    setAdded(true);
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-black text-white py-5 px-12 font-label text-xs uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
    >
      Přidat do košíku
    </button>
  );
}
