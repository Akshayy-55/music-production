"use client";

import { cn } from "@/lib/utils";

const LEDS = 8;

export function VuMeter({
  level,
  vertical = true,
}: {
  level: number;
  vertical?: boolean;
}) {
  const v = Math.max(0, Math.min(1, level));
  const lit = Math.round(v * LEDS);

  return (
    <div
      className={cn(
        "flex gap-[3px]",
        vertical ? "h-[148px] w-3 flex-col-reverse" : "h-3 w-full flex-row"
      )}
      aria-hidden
    >
      {Array.from({ length: LEDS }, (_, i) => {
        const on = i < lit;
        const hot = i >= LEDS - 2;
        const warn = i >= LEDS - 4 && i < LEDS - 2;
        return (
          <span
            key={i}
            className={cn(
              "vu-led flex-1",
              on
                ? hot
                  ? "bg-rose-500 shadow-[0_0_6px_#f43f5e]"
                  : warn
                    ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                    : "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                : "bg-zinc-800"
            )}
            style={{ opacity: on ? 1 : 0.45 }}
          />
        );
      })}
    </div>
  );
}
