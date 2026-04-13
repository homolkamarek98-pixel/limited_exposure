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
  id, title, photographerName, photographerId,
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
      {/* Mat board + image */}
      <div className="bg-surface-container-highest p-6 mb-6 transition-all duration-500 group-hover:p-4">
        <div className="aspect-[3/4] overflow-hidden bg-surface-dim">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="serif-display text-lg font-bold mb-1 truncate">{title}</h3>
          <p className="font-body text-sm text-secondary uppercase tracking-wider truncate">
            {photographerName}
          </p>
          <p className="font-label text-xs text-outline mt-1">{formatPrice(price)}</p>
        </div>
        <div className="shrink-0 mt-1">
          <EditionBadge
            type={editionType}
            totalCount={totalCount}
            soldCount={soldCount}
            availableUntil={availableUntil}
            variant="card"
          />
        </div>
      </div>

      {/* Progress bar */}
      {editionType === "LIMITED_COUNT" && totalCount !== null && totalCount > 0 && (
        <div>
          {(() => {
            const remaining = totalCount - soldCount;
            const pct = Math.min(100, Math.round((soldCount / totalCount) * 100));
            const urgent = remaining <= Math.ceil(totalCount * 0.2);
            return (
              <>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={["font-label text-[9px] uppercase tracking-widest", urgent ? "text-red-500" : "text-outline"].join(" ")}>
                    {remaining <= 0 ? "Vyprodáno" : urgent ? `Zbývá ${remaining} ${remaining === 1 ? "kus" : remaining < 5 ? "kusy" : "kusů"}` : `${remaining} z ${totalCount}`}
                  </span>
                  <span className="font-label text-[9px] text-outline/60">{pct} %</span>
                </div>
                <div className="h-0.5 bg-outline-variant/20 w-full overflow-hidden">
                  <div
                    className={["h-full", urgent ? "bg-red-500" : "bg-primary"].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}
    </Link>
  );
}
