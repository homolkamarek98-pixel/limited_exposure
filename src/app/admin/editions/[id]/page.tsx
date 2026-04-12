import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateEdition, deleteEdition } from "@/lib/actions";

type Props = { params: Promise<{ id: string }> };

function formatDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditEditionPage({ params }: Props) {
  const { id } = await params;

  const edition = await prisma.edition.findUnique({
    where: { id },
    include: {
      photo: {
        include: { photographer: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  if (!edition) notFound();

  const updateAction = updateEdition.bind(null, id);
  const deleteAction = deleteEdition.bind(null, id);

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/editions" className="font-label text-xs text-outline hover:text-primary transition-colors uppercase tracking-widest">
          ← Zpět
        </Link>
        <span className="text-outline-variant/50">|</span>
        <h1 className="serif-display text-3xl font-black tracking-tighter">{edition.photo.title}</h1>
      </div>

      {/* Info */}
      <div className="bg-surface-container-low border border-outline-variant/20 px-6 py-4 flex gap-6 flex-wrap">
        <div>
          <div className="font-label text-[10px] uppercase tracking-widest text-outline mb-1">Fotograf</div>
          <div className="font-body text-sm">{edition.photo.photographer.user.name ?? "—"}</div>
        </div>
        <div>
          <div className="font-label text-[10px] uppercase tracking-widest text-outline mb-1">Prodáno</div>
          <div className="font-body text-sm font-medium">{edition.soldCount}{edition.totalCount ? ` / ${edition.totalCount}` : ""}</div>
        </div>
        <div>
          <div className="font-label text-[10px] uppercase tracking-widest text-outline mb-1">Veřejný odkaz</div>
          <Link href={`/listing/${id}`} target="_blank" className="font-label text-[10px] uppercase tracking-widest text-primary hover:opacity-60 transition-opacity">
            /listing/{id.slice(0, 8)}… →
          </Link>
        </div>
      </div>

      <form action={updateAction} className="bg-surface border border-outline-variant/20 p-8 space-y-8">
        {/* Tier */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Tier</label>
          <div className="flex gap-6">
            {[
              { value: "RISING_TALENT", label: "Rising Talent" },
              { value: "SIGNATURE", label: "Signature Series" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tier" value={value} defaultChecked={edition.tier === value} className="accent-primary" />
                <span className="font-label text-xs uppercase tracking-widest">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Typ edice</label>
          <div className="flex gap-6">
            {[
              { value: "LIMITED_COUNT", label: "Počet kusů" },
              { value: "TIME_WINDOW", label: "Časové okno" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value={value} defaultChecked={edition.type === value} className="accent-primary" />
                <span className="font-label text-xs uppercase tracking-widest">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Cena (Kč)</label>
          <input
            type="number"
            name="price"
            min="0"
            step="100"
            defaultValue={edition.price / 100}
            required
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Count fields */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Celkový počet</label>
            <input
              type="number"
              name="totalCount"
              min="1"
              defaultValue={edition.totalCount ?? ""}
              placeholder="—"
              className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Prodáno</label>
            <input
              type="number"
              name="soldCount"
              min="0"
              defaultValue={edition.soldCount}
              className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Dostupná do</label>
          <input
            type="datetime-local"
            name="availableUntil"
            defaultValue={edition.availableUntil ? formatDatetimeLocal(edition.availableUntil) : ""}
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <button type="submit" className="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
            Uložit změny
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="bg-surface border border-error/30 p-6 space-y-4">
        <h2 className="font-label text-[10px] uppercase tracking-widest text-error">Nebezpečná zóna</h2>
        <p className="font-body text-sm text-on-surface-variant">
          Smazání edice je nevratné. Fotografie zůstane zachována.
        </p>
        <form action={deleteAction}>
          <button
            type="submit"
            className="border border-error text-error px-6 py-2 font-label text-xs uppercase tracking-widest hover:bg-error hover:text-on-primary transition-colors"
          >
            Smazat edici
          </button>
        </form>
      </div>
    </div>
  );
}
