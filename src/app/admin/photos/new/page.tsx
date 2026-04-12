import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPhoto } from "@/lib/actions";

export default async function NewPhotoPage() {
  const photographers = await prisma.photographer.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/photos" className="font-label text-xs text-outline hover:text-primary transition-colors uppercase tracking-widest">
          ← Zpět
        </Link>
        <span className="text-outline-variant/50">|</span>
        <h1 className="serif-display text-3xl font-black tracking-tighter">Nová fotografie</h1>
      </div>

      <form action={createPhoto} className="bg-surface border border-outline-variant/20 p-8 space-y-8">
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Fotograf
          </label>
          <select
            name="photographerId"
            required
            className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Vyberte fotografa…</option>
            {photographers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user.name ?? p.id}
              </option>
            ))}
          </select>
        </div>

        <Field label="Název díla" name="title" required />
        <Field label="Popis" name="description" textarea />
        <Field label="URL fotografie" name="imageUrl" placeholder="https://…" required />

        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
            Formát
          </label>
          <div className="flex gap-3">
            {(["S", "M", "L"] as const).map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" value={f} defaultChecked={f === "M"} className="accent-primary" />
                <span className="font-label text-xs uppercase tracking-widest">
                  {f === "S" ? "S — 30×40" : f === "M" ? "M — 50×70" : "L — 70×100"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <button
            type="submit"
            className="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Vytvořit fotografii
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, name, textarea = false, placeholder = "", required = false,
}: {
  label: string; name: string; textarea?: boolean; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  );
}
