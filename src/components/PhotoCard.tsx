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
      {/* Plnobarevná fotka — jediná barva na stránce */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3ede3] mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
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

      {/* Caption */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-medium tracking-[-0.01em] leading-snug truncate text-[#1a1714]">{title}</h3>
          <span className="otisk-mono text-[11px] text-[#1a1714] shrink-0">{formatPrice(price)}</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170]">{photographerName}</p>

        {/* Progress bar — LIMITED_COUNT */}
        {editionType === "LIMITED_COUNT" && totalCount !== null && totalCount > 0 && (
          <div className="pt-1.5">
            {(() => {
              const remaining = totalCount - soldCount;
              const pct = Math.min(100, Math.round((soldCount / totalCount) * 100));
              const urgent = remaining <= Math.ceil(totalCount * 0.2);
              return (
                <>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={["otisk-mono text-[10px] uppercase", urgent ? "text-[#b2401c]" : "text-[#8a8170]"].join(" ")}>
                      {remaining <= 0 ? "Vyprodáno" : urgent ? `Zbývá ${remaining} ${remaining === 1 ? "kus" : remaining < 5 ? "kusy" : "kusů"}` : `${remaining} / ${totalCount}`}
                    </span>
                    <span className="otisk-mono text-[10px] text-[#c4bba9]">{pct} %</span>
                  </div>
                  <div className="h-px bg-[#e7dfd2] w-full overflow-hidden">
                    <div
                      className={["h-full", urgent ? "bg-[#b2401c]" : "bg-[#1a1714]"].join(" ")}
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
          <div className="pt-1.5">
            {(() => {
              // Server component — čas se počítá při renderu, ne reaktivně
              // eslint-disable-next-line react-hooks/purity
              const now = Date.now();
              const deadline = new Date(availableUntil).getTime();
              const msLeft = deadline - now;
              if (msLeft <= 0) {
                return (
                  <>
                    <div className="mb-1.5">
                      <span className="otisk-mono text-[10px] uppercase text-[#b2401c]">Edice uzavřena</span>
                    </div>
                    <div className="h-px bg-[#e7dfd2] w-full" />
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
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={["otisk-mono text-[10px] uppercase", urgent ? "text-[#b2401c]" : "text-[#8a8170]"].join(" ")}>
                      {label}
                    </span>
                    <span className="otisk-mono text-[10px] text-[#c4bba9]">časová edice</span>
                  </div>
                  <div className="h-px bg-[#e7dfd2] w-full overflow-hidden">
                    <div
                      className={["h-full transition-all", urgent ? "bg-[#b2401c]" : "bg-[#1a1714]"].join(" ")}
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
