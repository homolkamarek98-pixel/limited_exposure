import Link from "next/link";
import EditionBadge from "./EditionBadge";

type Props = {
  id: string;           // edition id
  title: string;
  photographerName: string;
  photographerId: string;
  imageUrl: string;
  price: number;        // haléře
  editionType: "LIMITED_COUNT" | "TIME_WINDOW";
  totalCount: number | null;
  soldCount: number;
  availableUntil: Date | null;
  offset?: boolean;     // stagger effect (md:mt-12 nebo md:mt-24)
};

function formatPrice(halere: number) {
  const czk = halere / 100;
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(czk);
}

export default function PhotoCard({
  id, title, photographerName,
  imageUrl, price, editionType, totalCount, soldCount, availableUntil,
  offset,
}: Props) {
  return (
    <Link
      href={`/listing/${id}`}
      className={[
        "group block cursor-pointer",
        offset === true ? "md:mt-12" : offset === false ? "md:mt-24" : "",
      ].join(" ")}
    >
      {/* Full-bleed image — no mat board */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e4dc] mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover grayscale group-hover:scale-[1.04] transition-transform duration-700"
        />
        {/* Edition badge — top right overlay */}
        <div className="absolute top-3 right-3">
          <EditionBadge
            type={editionType}
            totalCount={totalCount}
            soldCount={soldCount}
            availableUntil={availableUntil}
            variant="card"
          />
        </div>
      </div>

      {/* Caption — instagram style */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="serif-display text-sm font-bold leading-snug truncate">{title}</h3>
          <span className="font-label text-[10px] text-[#8a8070] shrink-0">{formatPrice(price)}</span>
        </div>
        <p className="font-label text-[9px] uppercase tracking-[0.15em] text-[#8a8070]">{photographerName}</p>

        {/* Progress bar — LIMITED_COUNT */}
        {editionType === "LIMITED_COUNT" && totalCount !== null && totalCount > 0 && (
          <div className="pt-1">
            {(() => {
              const remaining = totalCount - soldCount;
              const pct = Math.min(100, Math.round((soldCount / totalCount) * 100));
              const urgent = remaining <= Math.ceil(totalCount * 0.2);
              return (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className={["font-label text-[9px] uppercase tracking-widest", urgent ? "text-red-500" : "text-[#a09880]"].join(" ")}>
                      {remaining <= 0 ? "Vyprodáno" : urgent ? `Zbývá ${remaining} ${remaining === 1 ? "kus" : remaining < 5 ? "kusy" : "kusů"}` : `${remaining} z ${totalCount}`}
                    </span>
                    <span className="font-label text-[9px] text-[#c0b8a8]">{pct} %</span>
                  </div>
                  <div className="h-px bg-[#e0dcd4] w-full overflow-hidden">
                    <div
                      className={["h-full", urgent ? "bg-red-500" : "bg-[#1c1811]"].join(" ")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Progress bar — TIME_WINDOW */}
        {editionType === "TIME_WINDOW" && availableUntil && (
          <div className="pt-1">
            {(() => {
              const now = Date.now();
              const deadline = new Date(availableUntil).getTime();
              const msLeft = deadline - now;
              if (msLeft <= 0) {
                return (
                  <>
                    <div className="mb-1">
                      <span className="font-label text-[9px] uppercase tracking-widest text-red-500">Edice uzavřena</span>
                    </div>
                    <div className="h-px bg-[#e0dcd4] w-full" />
                  </>
                );
              }
              const hoursLeft = msLeft / (1000 * 3600);
              const urgent = hoursLeft < 24;
              const pct = Math.max(0, Math.min(100, Math.round((msLeft / (7 * 24 * 3600 * 1000)) * 100)));
              const label = hoursLeft < 1
                ? `Zbývá ${Math.floor(msLeft / 60000)} min`
                : hoursLeft < 48
                ? `Zbývá ${Math.round(hoursLeft)} h`
                : `Zbývá ${Math.floor(hoursLeft / 24)} ${Math.floor(hoursLeft / 24) === 1 ? "den" : Math.floor(hoursLeft / 24) < 5 ? "dny" : "dní"}`;
              return (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className={["font-label text-[9px] uppercase tracking-widest", urgent ? "text-red-500" : "text-[#a09880]"].join(" ")}>
                      {label}
                    </span>
                    <span className="font-label text-[9px] text-[#c0b8a8]">časová edice</span>
                  </div>
                  <div className="h-px bg-[#e0dcd4] w-full overflow-hidden">
                    <div
                      className={["h-full transition-all", urgent ? "bg-red-500" : "bg-[#1c1811]"].join(" ")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </Link>
  );
}
