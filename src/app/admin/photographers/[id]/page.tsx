import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updatePhotographer } from "@/lib/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditPhotographerPage({ params }: Props) {
  const { id } = await params;

  const photographer = await prisma.photographer.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!photographer) notFound();

  const action = updatePhotographer.bind(null, id);

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/photographers" className="font-label text-xs text-outline hover:text-primary transition-colors uppercase tracking-widest">
          ← Zpět
        </Link>
        <span className="text-outline-variant/50">|</span>
        <h1 className="serif-display text-3xl font-black tracking-tighter">
          {photographer.user.name ?? photographer.user.email}
        </h1>
      </div>

      <form action={action} className="bg-surface border border-outline-variant/20 p-8 space-y-8">
        <Field label="Jméno" name="name" defaultValue={photographer.user.name ?? ""} />
        <Field label="Bio" name="bio" defaultValue={photographer.bio} textarea />
        <Field label="Instagram" name="instagram" defaultValue={photographer.instagram} placeholder="@handle" />
        <Field label="Celkové prodeje" name="totalSales" type="number" defaultValue={String(photographer.totalSales)} />

        <div className="pt-4 border-t border-outline-variant/20 flex items-center gap-4">
          <button
            type="submit"
            className="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Uložit změny
          </button>
          <Link
            href={`/photographer/${id}`}
            target="_blank"
            className="font-label text-xs uppercase tracking-widest text-outline hover:text-primary transition-colors"
          >
            Zobrazit profil →
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  textarea = false,
  placeholder = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="font-label text-[10px] uppercase tracking-widest font-bold block text-on-surface-variant">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={4}
          className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  );
}
