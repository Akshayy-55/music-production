"use client";

import { cn } from "@/lib/utils";

export function JogWheel({
  playing,
  color = "cyan",
  onNudge,
  label,
}: {
  playing: boolean;
  color?: "cyan" | "amber";
  onNudge: (dir: -1 | 1) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "jog-platter relative h-28 w-28 rounded-full sm:h-32 sm:w-32",
          playing && "jog-spin"
        )}
      >
        <span
          className={cn(
            "absolute inset-[28%] rounded-full border-4 bg-zinc-950",
            color === "cyan" ? "border-cyan-400/70" : "border-amber-400/70"
          )}
        />
        <span className="absolute left-1/2 top-2 h-3 w-1 -translate-x-1/2 rounded-sm bg-zinc-200" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onNudge(-1)}
          className="rounded-md border border-zinc-600 bg-zinc-900 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-300 hover:border-zinc-400"
        >
          Nudge −
        </button>
        <button
          type="button"
          onClick={() => onNudge(1)}
          className="rounded-md border border-zinc-600 bg-zinc-900 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-300 hover:border-zinc-400"
        >
          Nudge +
        </button>
      </div>
    </div>
  );
}
