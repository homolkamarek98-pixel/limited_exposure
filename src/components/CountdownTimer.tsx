"use client";

import { useEffect, useState } from "react";

function getTimeLeft(deadline: Date) {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
    expired: diff === 0,
  };
}

export default function CountdownTimer({ deadline }: { deadline: Date }) {
  const [time, setTime] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(deadline)), 1_000);
    return () => clearInterval(id);
  }, [deadline]);

  if (time.expired) {
    return (
      <span className="text-xs uppercase tracking-[0.18em] text-[#b2401c]">
        Edice skončila
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const isUrgent = time.h === 0;

  return (
    <div className={`flex items-baseline gap-4 ${isUrgent ? "text-[#b2401c]" : "text-[#1a1714]"}`}>
      {[
        { val: time.h, label: "hod" },
        { val: time.m, label: "min" },
        { val: time.s, label: "sec" },
      ].map(({ val, label }, i) => (
        <span key={label} className="flex items-baseline gap-2">
          {i > 0 && <span className="text-2xl font-light opacity-30">:</span>}
          <span className="text-center">
            <span className="otisk-mono block text-3xl font-medium">{pad(val)}</span>
            <span className="text-[10px] uppercase tracking-[0.18em] opacity-60">{label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
