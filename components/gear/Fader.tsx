"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export function Fader({
  value,
  min = 0,
  max = 1,
  onChange,
  height = 148,
  label,
  accent = "white",
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  height?: number;
  label?: string;
  accent?: "white" | "cyan" | "violet";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const span = max - min;
  const t = span === 0 ? 0 : (value - min) / span;
  const top = (1 - t) * 100;

  const setFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = 1 - (clientY - rect.top) / rect.height;
      const next = min + Math.max(0, Math.min(1, p)) * span;
      onChange(next);
    },
    [min, onChange, span]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientY(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    setFromClientY(e.clientY);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </span>
      )}
      <div
        ref={trackRef}
        className="fader-track"
        style={{ height }}
        role="slider"
        aria-label={label ?? "Fader"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(2))}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={(e) => {
          const delta = span * 0.05;
          if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            onChange(Math.min(max, value + delta));
          }
          if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            onChange(Math.max(min, value - delta));
          }
        }}
      >
        <span className="fader-groove" />
        <span
          className={cn(
            "fader-cap",
            accent === "cyan" && "ring-1 ring-cyan-300/50",
            accent === "violet" && "ring-1 ring-violet-300/50"
          )}
          style={{ top: `${top}%` }}
        />
      </div>
    </div>
  );
}
