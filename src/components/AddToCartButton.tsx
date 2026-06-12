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
      <div className="w-full bg-[#f3ede3] py-5 px-12 text-[10px] uppercase tracking-[0.2em] text-[#8a8170] text-center border border-[#e7dfd2]">
        {soldOut ? "Edice vyprodána" : "Edice vypršela"}
      </div>
    );
  }

  if (inCart || added) {
    return (
      <div className="w-full bg-[#1a1714] text-[#faf6f0] py-5 px-12 text-[10px] uppercase tracking-[0.2em] text-center">
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
      className="w-full bg-[#1a1714] text-[#faf6f0] py-5 px-12 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
    >
      Získat do sbírky
    </button>
  );
}
