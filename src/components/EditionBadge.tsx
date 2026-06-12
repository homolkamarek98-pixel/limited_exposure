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
      <span className="otisk-mono text-[10px] bg-[#faf6f0]/90 backdrop-blur-sm px-2.5 py-1 uppercase text-[#8a8170]">
        Vyprodáno
      </span>
    );
  }

  if (type === "LIMITED_COUNT" && totalCount !== null) {
    if (variant === "card") {
      return (
        <span className="otisk-mono text-[10px] bg-[#faf6f0]/90 backdrop-blur-sm px-2.5 py-1 uppercase text-[#1a1714]">
          {soldCount} / {totalCount}
        </span>
      );
    }
    return (
      <div className="flex flex-col items-end">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#b2401c]">
          Limitovaná edice
        </span>
        <span className="otisk-mono text-sm text-[#57503f]">
          zbývá {remaining} z {totalCount}
        </span>
      </div>
    );
  }

  if (type === "TIME_WINDOW" && availableUntil) {
    if (variant === "card") {
      return (
        <span className="otisk-mono text-[10px] bg-[#faf6f0]/90 backdrop-blur-sm px-2.5 py-1 uppercase text-[#1a1714]">
          Časová edice
        </span>
      );
    }
    return (
      <div className="flex flex-col items-start gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">
          Edice vyprší za:
        </span>
        <CountdownTimer deadline={availableUntil} />
      </div>
    );
  }

  return null;
}
