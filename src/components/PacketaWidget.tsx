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

function loadPacketaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Packeta) {
      resolve();
      return;
    }
    const existing = document.getElementById("packeta-library-script");
    if (existing) {
      // Skript už je v DOM — čekáme na window.Packeta
      const check = setInterval(() => {
        if (window.Packeta) { clearInterval(check); resolve(); }
      }, 100);
      setTimeout(() => { clearInterval(check); reject(new Error("timeout")); }, 10000);
      return;
    }
    const script = document.createElement("script");
    script.id = "packeta-library-script";
    script.src = "https://widget.packeta.com/v6/www/js/library.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Script load failed"));
    document.head.appendChild(script);
  });
}

export default function PacketaWidget({ apiKey, onSelect, selected }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // Skript načteme co nejdříve — hned při mountu
  useEffect(() => {
    loadPacketaScript().catch(() => {});
  }, []);

  // Volej pick() až po re-renderu kdy je container viditelný
  useEffect(() => {
    if (!open || !containerRef.current) return;
    if (!window.Packeta) return;
    window.Packeta.Widget.pick(
      apiKey,
      (point) => {
        setOpen(false);
        setStatus("idle");
        if (point) onSelect(point);
      },
      { language: "cs" },
      containerRef.current
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleClick() {
    if (open) return;
    setStatus("loading");
    try {
      await loadPacketaScript();
      setStatus("idle");
      setOpen(true);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={open}
        className="w-full border-2 border-black bg-white font-label text-[10px] uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-colors disabled:opacity-40"
      >
        {status === "loading" ? (
          "Načítám…"
        ) : status === "error" ? (
          "Chyba načtení — klikněte znovu"
        ) : (
          "Vybrat výdejní místo →"
        )}
      </button>

      {selected && (
        <div className="mt-3 bg-[#f3f3f4] px-4 py-3 flex justify-between items-start">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest font-bold">{selected.name}</p>
            <p className="font-label text-[10px] text-[#777] mt-0.5">{selected.nameStreet}, {selected.zip} {selected.city}</p>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="font-label text-[10px] uppercase tracking-widest text-[#999] hover:text-black transition-colors shrink-0 ml-4"
          >
            Změnit
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={open ? "fixed inset-0 z-[100] bg-white" : "hidden"}
      />
    </div>
  );
}
