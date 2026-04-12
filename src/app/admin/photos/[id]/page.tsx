import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updatePhoto, deletePhoto } from "@/lib/actions";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditPhotoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { created } = await searchParams;

  const [photo, photographers] = await Promise.all([
    prisma.photo.findUnique({
      where: { id },
      include: {
        photographer: { include: { user: { select: { name: true } } } },
        editions: { select: { id: true, tier: true, price: true, type: true } },
      },
    }),
    prisma.photographer.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  if (!photo) notFound();

  const updateAction = updatePhoto.bind(null, id);
  const deleteAction = deletePhoto.bind(null, id);

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/photos" className="font-label text-xs text-outline hover:text-primary transition-colors uppercase tracking-widest">
          ← Zpět
        </Link>
        <span className="text-outline-variant/50">|</span>
        <h1 className="serif-display text-3xl font-black tracking-tighter">{photo.title}</h1>
      </div>

      {created && (
        <div className="bg-surface-container-low border border-outline-variant/20 px-6 py-4 font-label text-xs uppercase tracking-widest text-secondary">
          Fotografie vytvořena. Nyní přidejte edici.
        </div>
      )}

      <form action={updateAction} className="bg-surface border border-outline-variant/20 p-8 space-y-8">
        {/* Photographer select */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Fotograf</label>
          <select
            name="photographerId"
            defaultValue={photo.photographerId}
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          >
            {photographers.map((p) => (
              <option key={p.id} value={p.id}>{p.user.name ?? p.id}</option>
            ))}
          </select>
        </div>

        <Field label="Název díla" name="title" defaultValue={photo.title} />
        <Field label="Popis" name="description" defaultValue={photo.description} textarea />
        <Field label="URL fotografie" name="imageUrl" defaultValue={photo.imageUrl} />

        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">Formát</label>
          <div className="flex gap-3">
            {(["S", "M", "L"] as const).map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" value={f} defaultChecked={photo.format === f} className="accent-primary" />
                <span className="font-label text-xs uppercase tracking-widest">
                  {f === "S" ? "S — 30×40" : f === "M" ? "M — 50×70" : "L — 70×100"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button type="submit" className="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Uložit změny
            </button>
            <Link href={photo.editions[0] ? `/listing/${photo.editions[0].id}` : "#"} target="_blank" className="font-label text-xs uppercase tracking-widest text-outline hover:text-primary transition-colors">
              Zobrazit →
            </Link>
          </div>

          {photo.editions.length === 0 && (
            <Link
              href={`/admin/editions/new?photoId=${photo.id}`}
              className="font-label text-xs uppercase tracking-widest border border-outline-variant/30 px-4 py-3 hover:border-primary hover:text-primary transition-colors"
            >
              + Přidat edici
            </Link>
          )}
        </div>
      </form>

      {/* Editions summary */}
      {photo.editions.length > 0 && (
        <div className="bg-surface border border-outline-variant/20 p-6 space-y-3">
          <h2 className="font-label text-[10px] uppercase tracking-widest text-outline">Edice</h2>
          {photo.editions.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2 border-t border-outline-variant/20">
              <span className="font-body text-sm">
                {e.tier === "SIGNATURE" ? "Signature Series" : "Rising Talent"} · {e.type}
              </span>
              <Link href={`/admin/editions/${e.id}`} className="font-label text-xs uppercase tracking-widest text-outline hover:text-primary transition-colors">
                Upravit edici →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-surface border border-error/30 p-6 space-y-4">
        <h2 className="font-label text-[10px] uppercase tracking-widest text-error">Nebezpečná zóna</h2>
        <p className="font-body text-sm text-on-surface-variant">
          Smazání fotografie je nevratné. Všechny přidružené edice budou také smazány.
        </p>
        <form action={deleteAction}>
          <button
            type="submit"
            className="border border-error text-error px-6 py-2 font-label text-xs uppercase tracking-widest hover:bg-error hover:text-on-primary transition-colors"
          >
            Smazat fotografii
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue = "", textarea = false }: { label: string; name: string; defaultValue?: string; textarea?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
      ) : (
        <input type="text" name={name} defaultValue={defaultValue} className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors" />
      )}
    </div>
  );
}
