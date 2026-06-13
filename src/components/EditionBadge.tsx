import CountdownTimer from "./CountdownTimer";

type Props = {
  type: "LIMITED_COUNT" | "TIME_WINDOW";
  totalCount: number | null;
  soldCount: number;
  availableUntil: Date | null;
  variant?: "card" | "detail"; // card = kompaktní, detail = rozvinuté
};

export default function EditionBadge({
  type, totalCount, soldCount, availableUntil, variant = "card",
}: Props) {
  const isSoldOut = type === "LIMITED_COUNT" && totalCount !== null && soldCount >= totalCount;
  const remaining = totalCount !== null ? totalCount - soldCount : null;

  if (isSoldOut) {
    return (
      <span className="font-label text-[10px] border border-[#8e8779] px-3 py-1 uppercase tracking-tighter text-[#8e8779]">
        Vyprodáno
      </span>
    );
  }

  if (type === "LIMITED_COUNT" && totalCount !== null) {
    if (variant === "card") {
      return (
        <span className="font-label text-[10px] border border-[#8e8779] px-3 py-1 uppercase tracking-tighter">
          {soldCount} / {totalCount}
        </span>
      );
    }
    return (
      <div className="flex flex-col items-end">
        <span className="font-label text-[10px] uppercase tracking-widest text-[#a8432a] font-bold">
          Limitovaná edice
        </span>
        <span className="font-body text-sm text-[#3a352b]">
          zbývá {remaining} z {totalCount}
        </span>
      </div>
    );
  }

  if (type === "TIME_WINDOW" && availableUntil) {
    if (variant === "card") {
      return (
        <span className="font-label text-[10px] border border-[#8e8779] px-3 py-1 uppercase tracking-tighter">
          Časová edice
        </span>
      );
    }
    return (
      <div className="flex flex-col items-start gap-2">
        <span className="font-label text-[10px] uppercase tracking-widest text-[#8e8779]">
          Edice vyprší za:
        </span>
        <CountdownTimer deadline={availableUntil} />
      </div>
    );
  }

  return null;
}
