"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export function Knob({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  size = 56,
  unit = "",
  accent = "violet",
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  size?: number;
  unit?: string;
  accent?: "violet" | "cyan" | "amber" | "rose";
  format?: (v: number) => string;
}) {
  const start = useRef({ y: 0, value: 0 });
  const span = max - min;
  const t = span === 0 ? 0 : (value - min) / span;
  const rotation = t * 270 - 135;

  const accents = {
    violet: "text-violet-300",
    cyan: "text-cyan-300",
    amber: "text-amber-300",
    rose: "text-rose-300",
  };

  const applyFromDelta = useCallback(
    (dy: number, origin: number) => {
      const next = origin - dy * (span / 110);
      const snapped = Math.round(next / step) * step;
      onChange(Math.max(min, Math.min(max, snapped)));
    },
    [max, min, onChange, span, step]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { y: e.clientY, value };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    applyFromDelta(e.clientY - start.current.y, start.current.value);
  };

  const display = format
    ? format(value)
    : `${value > 0 ? "+" : ""}${value}${unit}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <button
        type="button"
        className="knob relative"
        style={{ width: size, height: size }}
        aria-label={`${label} ${display}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onDoubleClick={() => onChange(min < 0 && max > 0 ? 0 : min)}
      >
        <span className="knob-ring" />
        <span
          className="knob-cap block h-full w-full"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <span className="knob-pointer" />
        </span>
      </button>
      <span className={cn("text-[10px] tabular-nums", accents[accent])}>
        {display}
      </span>
    </div>
  );
}
