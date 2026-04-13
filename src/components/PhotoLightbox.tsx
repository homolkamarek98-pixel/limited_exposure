"use client";

import { useEffect, useState } from "react";

interface Props {
  src: string;
  alt: string;
  children: React.ReactNode; // trigger element (image wrapper)
}

export default function PhotoLightbox({ src, alt, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-zoom-in">
        {children}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/96 flex items-center justify-center p-4 md:p-16"
          onClick={() => setOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-8 font-label text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Zavřít
          </button>

          {/* Image — stop propagation so clicking photo doesn't close */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain grayscale select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Hint */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-label text-[10px] uppercase tracking-widest text-white/30">
            Klikněte mimo pro zavření · ESC
          </p>
        </div>
      )}
    </>
  );
}
