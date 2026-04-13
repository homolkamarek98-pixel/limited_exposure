"use client";

import { useEffect, useRef, useState } from "react";

interface PickupPoint {
  id: string;
  name: string;
  nameStreet: string;
  city: string;
  zip: string;
}

interface Props {
  apiKey: string;
  onSelect: (point: PickupPoint) => void;
  selected: PickupPoint | null;
}

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (
          apiKey: string,
          callback: (point: PickupPoint | null) => void,
          options: Record<string, unknown>,
          element: HTMLElement
        ) => void;
      };
    };
  }
}

export default function PacketaWidget({ apiKey, onSelect, selected }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (document.getElementById("packeta-widget-script")) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "packeta-widget-script";
    script.src = "https://widget.packeta.com/www/js/lib/widget.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  function openWidget() {
    if (!loaded || !window.Packeta || !containerRef.current) return;
    setOpen(true);
    window.Packeta.Widget.pick(
      apiKey,
      (point) => {
        setOpen(false);
        if (point) onSelect(point);
      },
      { language: "cs" },
      containerRef.current
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={openWidget}
        disabled={!loaded}
        className="w-full border-2 border-black bg-white font-label text-[10px] uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-colors disabled:opacity-40"
      >
        {loaded ? "Vybrat výdejní místo →" : "Načítám widget…"}
      </button>

      {selected && (
        <div className="mt-3 bg-[#f3f3f4] px-4 py-3 flex justify-between items-start">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest font-bold">{selected.name}</p>
            <p className="font-label text-[10px] text-[#777] mt-0.5">{selected.nameStreet}, {selected.zip} {selected.city}</p>
          </div>
          <button
            type="button"
            onClick={openWidget}
            className="font-label text-[10px] uppercase tracking-widest text-[#999] hover:text-black transition-colors shrink-0 ml-4"
          >
            Změnit
          </button>
        </div>
      )}

      {/* Widget se renderuje sem */}
      <div
        ref={containerRef}
        className={open ? "fixed inset-0 z-[100] bg-white" : "hidden"}
      />
    </div>
  );
}
