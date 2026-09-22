"use client";

import { Check } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";

export function Checklist({
  lessonId,
  items,
}: {
  lessonId: string;
  items: string[];
}) {
  const { progress, ready, toggleChecklist } = useProgress();
  const checks = progress.checklist[lessonId] ?? items.map(() => false);

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const checked = checks[i] ?? false;
        return (
          <li key={i}>
            <button
              type="button"
              disabled={!ready}
              onClick={() => toggleChecklist(lessonId, i)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                checked
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-zinc-700/80 bg-zinc-900/60 hover:border-zinc-500"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  checked
                    ? "border-emerald-400 bg-emerald-500 text-zinc-950"
                    : "border-zinc-600 bg-zinc-800"
                )}
              >
                {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  "text-sm leading-relaxed",
                  checked ? "text-emerald-100" : "text-zinc-200"
                )}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
