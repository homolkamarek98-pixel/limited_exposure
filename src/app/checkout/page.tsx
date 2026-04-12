"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { createOrder } from "@/lib/actions";

const schema = z.object({
  firstName: z.string().min(2, "Povinné"),
  lastName: z.string().min(2, "Povinné"),
  email: z.email("Neplatný email"),
  phone: z.string().optional(),
  addressLine1: z.string().min(5, "Povinné"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Povinné"),
  postalCode: z.string().min(3, "Povinné"),
  country: z.string().min(2, "Povinné"),
  carrier: z.enum(["ZASILKOVNA", "CZECH_POST", "DPD", "PPL", "TOP_TRANS"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(halers / 100);
}

const carriers = [
  { value: "ZASILKOVNA", label: "Zásilkovna", price: 7900, note: "Výdejní místo nebo domů" },
  { value: "CZECH_POST", label: "Česká pošta", price: 9900, note: "Doporučené balení" },
  { value: "DPD", label: "DPD", price: 12900, note: "Expresní doručení" },
  { value: "PPL", label: "PPL", price: 12900, note: "Zásilka na ruku" },
  { value: "TOP_TRANS", label: "Top Trans", price: 0, note: "Kurýr pro formát L — cena na dotaz" },
] as const;

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "CZ", carrier: "ZASILKOVNA" },
  });

  const selectedCarrier = watch("carrier");
  const carrierPrice = carriers.find(c => c.value === selectedCarrier)?.price ?? 0;
  const grandTotal = totalAmount() + carrierPrice;

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <>
        <Nav />
        <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-24 pb-32 text-center">
          <p className="font-body text-secondary mb-8">Košík je prázdný</p>
          <a href="/gallery" className="font-label text-xs uppercase tracking-widest border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors">
            Zpět do galerie
          </a>
        </main>
        <Footer />
      </>
    );
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v != null) formData.set(k, String(v));
      });
      formData.set("items", JSON.stringify(items));
      formData.set("totalAmount", String(grandTotal));

      const result = await createOrder(formData);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order/${result.orderId}`);
    } catch {
      setError("Nepodařilo se vytvořit objednávku. Zkuste to prosím znovu.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">
        <div className="mb-16 border-b border-[#e8e8e8] pb-10">
          <span className="font-label text-xs uppercase tracking-widest text-[#777] block mb-3">Objednávka</span>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter uppercase">Pokladna</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left — form */}
          <div className="lg:col-span-7 space-y-12">

            {/* Contact */}
            <section>
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-8 pb-3 border-b border-[#e8e8e8]">
                Kontaktní údaje
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Jméno *</label>
                  <input {...register("firstName")} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Příjmení *</label>
                  <input {...register("lastName")} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Email *</label>
                  <input {...register("email")} type="email" className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Telefon</label>
                  <input {...register("phone")} type="tel" className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-8 pb-3 border-b border-[#e8e8e8]">
                Doručovací adresa
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Ulice a číslo *</label>
                  <input {...register("addressLine1")} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Doplněk adresy</label>
                  <input {...register("addressLine2")} placeholder="Byt, patro, firma…" className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors placeholder:text-[#bbb]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Město *</label>
                    <input {...register("city")} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest block mb-2">PSČ *</label>
                    <input {...register("postalCode")} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors" />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest block mb-2">Stát *</label>
                  <select {...register("country")} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors">
                    <option value="CZ">Česká republika</option>
                    <option value="SK">Slovensko</option>
                    <option value="DE">Německo</option>
                    <option value="AT">Rakousko</option>
                    <option value="PL">Polsko</option>
                    <option value="OTHER">Jiný stát</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Carrier */}
            <section>
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-8 pb-3 border-b border-[#e8e8e8]">
                Způsob dopravy
              </h2>
              <div className="space-y-3">
                {carriers.map((c) => (
                  <label
                    key={c.value}
                    className={[
                      "flex items-center justify-between p-4 border cursor-pointer transition-colors",
                      selectedCarrier === c.value
                        ? "border-black bg-[#fafafa]"
                        : "border-[#e0e0e0] hover:border-black",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        {...register("carrier")}
                        type="radio"
                        value={c.value}
                        className="sr-only"
                      />
                      <div className={["w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", selectedCarrier === c.value ? "border-black" : "border-[#ccc]"].join(" ")}>
                        {selectedCarrier === c.value && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                      <div>
                        <span className="font-label text-xs uppercase tracking-widest font-bold block">{c.label}</span>
                        <span className="font-label text-[10px] text-[#777]">{c.note}</span>
                      </div>
                    </div>
                    <span className="font-headline text-sm font-bold shrink-0">
                      {c.price === 0 ? "Na dotaz" : formatPrice(c.price)}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Notes */}
            <section>
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-4">Poznámka k objednávce</h2>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Nepovinné…"
              />
            </section>

          </div>

          {/* Right — summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-6 pb-3 border-b border-[#e8e8e8]">
                Shrnutí objednávky
              </h2>

              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.editionId} className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.photoTitle} className="w-16 h-16 object-cover shrink-0 grayscale" />
                    <div className="flex-1 min-w-0">
                      <p className="font-headline text-xs font-bold uppercase tracking-tight leading-tight line-clamp-2">{item.photoTitle}</p>
                      <p className="font-label text-[10px] text-[#777] uppercase tracking-widest">{item.photographerName}</p>
                      <p className="font-headline text-sm font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e8e8e8] pt-4 space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="font-label text-xs uppercase tracking-widest text-[#777]">Díla</span>
                  <span className="font-label text-xs">{formatPrice(totalAmount())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label text-xs uppercase tracking-widest text-[#777]">Doprava</span>
                  <span className="font-label text-xs">
                    {carrierPrice === 0 ? "Na dotaz" : formatPrice(carrierPrice)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#e8e8e8]">
                  <span className="font-label text-xs uppercase tracking-widest font-bold">Celkem</span>
                  <span className="font-headline text-lg font-black">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="bg-[#f3f3f4] p-4 mb-6">
                <p className="font-label text-[10px] uppercase tracking-widest font-bold mb-2">Platba bankovním převodem</p>
                <p className="font-body text-xs text-[#777] leading-relaxed">
                  Po odeslání objednávky obdržíte email s platebními instrukcemi a variabilním symbolem. Objednávka je rezervována po dobu 5 pracovních dní.
                </p>
              </div>

              {error && (
                <p className="text-red-600 text-sm mb-4 font-body">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white font-label text-[10px] uppercase tracking-widest py-5 hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Odesílám…" : "Odeslat objednávku →"}
              </button>

              <p className="font-label text-[10px] text-[#aaa] uppercase tracking-widest text-center mt-4">
                Pojištěná doprava · Certifikát pravosti · 14 dní na vrácení
              </p>
            </div>
          </div>

        </form>
      </main>
      <Footer />
    </>
  );
}
