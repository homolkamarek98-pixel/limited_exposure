import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createEdition } from "@/lib/actions";

type SearchParams = Promise<{ photoId?: string }>;

export default async function NewEditionPage({ searchParams }: { searchParams: SearchParams }) {
  const { photoId } = await searchParams;

  const photos = await prisma.photo.findMany({
    include: { photographer: { include: { user: { select: { name: true } } } } },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/editions" className="font-label text-xs text-outline hover:text-primary transition-colors uppercase tracking-widest">
          ← Zpět
        </Link>
        <span className="text-outline-variant/50">|</span>
        <h1 className="serif-display text-3xl font-black tracking-tighter">Nová edice</h1>
      </div>

      <form action={createEdition} className="bg-surface border border-outline-variant/20 p-8 space-y-8">
        {/* Foto */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Fotografie
          </label>
          <select
            name="photoId"
            required
            defaultValue={photoId ?? ""}
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Vyberte fotografii…</option>
            {photos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — {p.photographer.user.name ?? "?"}
              </option>
            ))}
          </select>
        </div>

        {/* Tier */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Tier
          </label>
          <div className="flex gap-6">
            {[
              { value: "RISING_TALENT", label: "Rising Talent" },
              { value: "SIGNATURE", label: "Signature Series" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tier" value={value} defaultChecked={value === "RISING_TALENT"} className="accent-primary" />
                <span className="font-label text-xs uppercase tracking-widest">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Typ edice
          </label>
          <div className="flex gap-6">
            {[
              { value: "LIMITED_COUNT", label: "Počet kusů" },
              { value: "TIME_WINDOW", label: "Časové okno" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value={value} defaultChecked={value === "LIMITED_COUNT"} className="accent-primary" />
                <span className="font-label text-xs uppercase tracking-widest">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Cena (Kč)
          </label>
          <input
            type="number"
            name="price"
            min="0"
            step="100"
            placeholder="9000"
            required
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <p className="font-label text-[10px] uppercase tracking-widest text-outline">Zadejte v celých Kč — 9 000 = 9 000 Kč</p>
        </div>

        {/* LIMITED_COUNT fields */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
              Celkový počet kusů
            </label>
            <input
              type="number"
              name="totalCount"
              min="1"
              placeholder="50"
              className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <p className="font-label text-[10px] text-outline">Pouze pro typ Počet kusů</p>
          </div>
          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
              Prodáno kusů
            </label>
            <input
              type="number"
              name="soldCount"
              min="0"
              defaultValue="0"
              className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* TIME_WINDOW field */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Dostupná do
          </label>
          <input
            type="datetime-local"
            name="availableUntil"
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <p className="font-label text-[10px] text-outline">Pouze pro typ Časové okno</p>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <button
            type="submit"
            className="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Vytvořit edici
          </button>
        </div>
      </form>
    </div>
  );
}
