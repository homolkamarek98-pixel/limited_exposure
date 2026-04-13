"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PacketaWidget from "@/components/PacketaWidget";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { createOrder } from "@/lib/actions";

const PACKETA_API_KEY = process.env.NEXT_PUBLIC_PACKETA_API_KEY ?? "";

const schema = z.object({
  firstName: z.string().min(2, "Povinné"),
  lastName: z.string().min(2, "Povinné"),
  email: z.email("Neplatný email"),
  phone: z.string().optional(),

  // Firma
  isCompany: z.boolean().optional(),
  companyName: z.string().optional(),
  ico: z.string().optional(),
  dic: z.string().optional(),

  // Fakturační adresa
  billingAddressLine1: z.string().min(3, "Povinné"),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().min(2, "Povinné"),
  billingPostalCode: z.string().min(3, "Povinné"),
  billingCountry: z.string().min(2, "Povinné"),

  // Doprava
  carrier: z.enum(["ZASILKOVNA", "CZECH_POST", "DPD", "PPL", "TOP_TRANS"]),

  // Oddělená dodací adresa
  differentDelivery: z.boolean().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),

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

interface PickupPoint {
  id: string;
  name: string;
  nameStreet: string;
  city: string;
  zip: string;
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { billingCountry: "CZ", country: "CZ", carrier: "ZASILKOVNA", isCompany: false, differentDelivery: false },
  });

  const selectedCarrier = watch("carrier");
  const isZasilkovna = selectedCarrier === "ZASILKOVNA";
  const isCompany = watch("isCompany");
  const differentDelivery = watch("differentDelivery");
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
    if (isZasilkovna && !pickupPoint) {
      setError("Vyberte prosím výdejní místo Zásilkovny.");
      return;
    }
    if (!isZasilkovna && data.differentDelivery && (!data.addressLine1 || !data.city || !data.postalCode)) {
      setError("Vyplňte prosím dodací adresu.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Základní údaje
      formData.set("firstName", data.firstName);
      formData.set("lastName", data.lastName);
      formData.set("email", data.email);
      if (data.phone) formData.set("phone", data.phone);
      if (data.notes) formData.set("notes", data.notes);

      // Firma
      if (data.isCompany) {
        if (data.companyName) formData.set("companyName", data.companyName);
        if (data.ico) formData.set("ico", data.ico);
        if (data.dic) formData.set("dic", data.dic);
      }

      // Fakturační adresa
      formData.set("billingAddressLine1", data.billingAddressLine1);
      formData.set("billingAddressLine2", data.billingAddressLine2 ?? "");
      formData.set("billingCity", data.billingCity);
      formData.set("billingPostalCode", data.billingPostalCode);
      formData.set("billingCountry", data.billingCountry);

      // Dodací adresa
      if (isZasilkovna && pickupPoint) {
        formData.set("pickupPointId", pickupPoint.id);
        formData.set("pickupPointName", pickupPoint.name);
        formData.set("addressLine1", pickupPoint.nameStreet);
        formData.set("city", pickupPoint.city);
        formData.set("postalCode", pickupPoint.zip);
        formData.set("country", "CZ");
      } else if (data.differentDelivery) {
        formData.set("addressLine1", data.addressLine1 ?? "");
        formData.set("addressLine2", data.addressLine2 ?? "");
        formData.set("city", data.city ?? "");
        formData.set("postalCode", data.postalCode ?? "");
        formData.set("country", data.country ?? "CZ");
      } else {
        // Dodací = fakturační
        formData.set("addressLine1", data.billingAddressLine1);
        formData.set("addressLine2", data.billingAddressLine2 ?? "");
        formData.set("city", data.billingCity);
        formData.set("postalCode", data.billingPostalCode);
        formData.set("country", data.billingCountry);
      }

      formData.set("carrier", data.carrier);
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

  const inputCls = "w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors";
  const labelCls = "font-label text-[10px] uppercase tracking-widest block mb-2";
  const sectionHead = "font-label text-[10px] uppercase tracking-widest font-bold mb-8 pb-3 border-b border-[#e8e8e8]";

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

            {/* Kontaktní a fakturační údaje */}
            <section>
              <h2 className={sectionHead}>Kontaktní a fakturační údaje</h2>

              {/* Jméno + příjmení */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Jméno *</label>
                  <input {...register("firstName")} autoComplete="given-name" className={inputCls} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Příjmení *</label>
                  <input {...register("lastName")} autoComplete="family-name" className={inputCls} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email + telefon */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={labelCls}>Email *</label>
                  <input {...register("email")} type="email" autoComplete="email" className={inputCls} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Telefon</label>
                  <input {...register("phone")} type="tel" autoComplete="tel" className={inputCls} />
                </div>
              </div>

              {/* Na firmu */}
              <label className="flex items-center gap-3 cursor-pointer mb-6">
                <input type="checkbox" {...register("isCompany")} className="w-4 h-4 accent-black" />
                <span className="font-label text-[10px] uppercase tracking-widest">Nakupuji na firmu (IČO / DIČ)</span>
              </label>

              {isCompany && (
                <div className="space-y-4 mb-6 pl-7 border-l-2 border-[#e8e8e8]">
                  <div>
                    <label className={labelCls}>Název firmy *</label>
                    <input {...register("companyName")} autoComplete="organization" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>IČO</label>
                      <input {...register("ico")} className={inputCls} placeholder="12345678" />
                    </div>
                    <div>
                      <label className={labelCls}>DIČ</label>
                      <input {...register("dic")} className={inputCls} placeholder="CZ12345678" />
                    </div>
                  </div>
                </div>
              )}

              {/* Fakturační adresa */}
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Ulice a číslo *</label>
                  <input {...register("billingAddressLine1")} autoComplete="billing address-line1" className={inputCls} />
                  {errors.billingAddressLine1 && <p className="text-red-500 text-xs mt-1">{errors.billingAddressLine1.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Doplněk adresy</label>
                  <input {...register("billingAddressLine2")} autoComplete="billing address-line2" placeholder="Byt, patro, firma…" className={inputCls + " placeholder:text-[#bbb]"} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Město *</label>
                    <input {...register("billingCity")} autoComplete="billing address-level2" className={inputCls} />
                    {errors.billingCity && <p className="text-red-500 text-xs mt-1">{errors.billingCity.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>PSČ *</label>
                    <input {...register("billingPostalCode")} autoComplete="billing postal-code" className={inputCls} />
                    {errors.billingPostalCode && <p className="text-red-500 text-xs mt-1">{errors.billingPostalCode.message}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Stát *</label>
                  <select {...register("billingCountry")} autoComplete="billing country" className={inputCls}>
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

            {/* Způsob dopravy */}
            <section>
              <h2 className={sectionHead}>Způsob dopravy</h2>
              <div className="space-y-3">
                {carriers.map((c) => (
                  <label
                    key={c.value}
                    className={[
                      "flex items-center justify-between p-4 border-2 cursor-pointer transition-colors",
                      selectedCarrier === c.value ? "border-black bg-[#fafafa]" : "border-[#e0e0e0] hover:border-black",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-4">
                      <input {...register("carrier")} type="radio" value={c.value} className="sr-only" />
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

            {/* Dodací adresa / Zásilkovna widget */}
            {isZasilkovna ? (
              <section>
                <h2 className={sectionHead}>Výdejní místo Zásilkovny</h2>
                <PacketaWidget
                  apiKey={PACKETA_API_KEY}
                  onSelect={setPickupPoint}
                  selected={pickupPoint}
                />
                {!pickupPoint && (
                  <p className="font-label text-[10px] text-[#aaa] uppercase tracking-widest mt-3">
                    Vyberte výdejní místo kliknutím na tlačítko výše
                  </p>
                )}
              </section>
            ) : (
              <section>
                <h2 className={sectionHead}>Dodací adresa</h2>
                <label className="flex items-center gap-3 cursor-pointer mb-6">
                  <input type="checkbox" {...register("differentDelivery")} className="w-4 h-4 accent-black" />
                  <span className="font-label text-[10px] uppercase tracking-widest">Doručit na jinou adresu</span>
                </label>

                {differentDelivery && (
                  <div className="space-y-4 pl-7 border-l-2 border-[#e8e8e8]">
                    <div>
                      <label className={labelCls}>Ulice a číslo *</label>
                      <input {...register("addressLine1")} autoComplete="shipping address-line1" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Doplněk adresy</label>
                      <input {...register("addressLine2")} autoComplete="shipping address-line2" placeholder="Byt, patro, firma…" className={inputCls + " placeholder:text-[#bbb]"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Město *</label>
                        <input {...register("city")} autoComplete="shipping address-level2" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>PSČ *</label>
                        <input {...register("postalCode")} autoComplete="shipping postal-code" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Stát *</label>
                      <select {...register("country")} autoComplete="shipping country" className={inputCls}>
                        <option value="CZ">Česká republika</option>
                        <option value="SK">Slovensko</option>
                        <option value="DE">Německo</option>
                        <option value="AT">Rakousko</option>
                        <option value="PL">Polsko</option>
                        <option value="OTHER">Jiný stát</option>
                      </select>
                    </div>
                  </div>
                )}

                {!differentDelivery && (
                  <p className="font-label text-[10px] text-[#aaa] uppercase tracking-widest">
                    Zásilka bude doručena na fakturační adresu
                  </p>
                )}
              </section>
            )}

            {/* Poznámka */}
            <section>
              <h2 className="font-label text-[10px] uppercase tracking-widest font-bold mb-4">Poznámka k objednávce</h2>
              <textarea {...register("notes")} rows={3} className={inputCls + " resize-none"} placeholder="Nepovinné…" />
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
                  <span className="font-label text-xs">{carrierPrice === 0 ? "Na dotaz" : formatPrice(carrierPrice)}</span>
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

              {error && <p className="text-red-600 text-sm mb-4 font-body">{error}</p>}

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
