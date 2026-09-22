"use client";

import { CheckCircle2, Lock, Loader } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { isLessonComplete, trackProgress } from "@/lib/progress";
import { isTrackLocked } from "@/lib/curriculum";
import { UNLOCK_LESSON } from "@/lib/types";
import type { TrackId } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS: { id: TrackId; title: string; blurb: string }[] = [
  {
    id: "shared",
    title: "Shared",
    blurb: "Pulse, EQ, phrases — the language both paths share.",
  },
  {
    id: "dj",
    title: "DJ",
    blurb: "Decks, cue mix, beatmatch, and a first recorded set.",
  },
  {
    id: "production",
    title: "Production",
    blurb: "DAW, drums, arrangement, and a finished export.",
  },
];

export function PathRoadmap() {
  const { progress, ready } = useProgress();
  if (!ready) {
    return <div className="h-32 animate-pulse rounded-2xl bg-zinc-900/50" />;
  }

  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {STEPS.map((step, i) => {
        const locked = isTrackLocked(step.id, progress.completedLessons);
        const tp = trackProgress(progress, step.id);
        const done = tp.total > 0 && tp.done === tp.total;
        const examDone = isLessonComplete(progress, UNLOCK_LESSON);
        const inProgress = !locked && !done && (tp.done > 0 || (step.id === "shared" && !examDone));
        const status = locked ? "Locked" : done ? "Done" : inProgress ? "In progress" : "Ready";

        return (
          <li
            key={step.id}
            className={cn(
              "relative rounded-2xl border p-4",
              locked
                ? "border-zinc-800 bg-zinc-950/50"
                : done
                  ? "border-emerald-500/30 bg-emerald-950/20"
                  : inProgress
                    ? "border-violet-500/35 bg-violet-950/25"
                    : "border-zinc-800 bg-zinc-900/50"
            )}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {i + 1} / 3
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  locked
                    ? "bg-zinc-800 text-zinc-400"
                    : done
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-violet-500/15 text-violet-200"
                )}
              >
                {locked ? (
                  <Lock className="h-3 w-3" />
                ) : done ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Loader className="h-3 w-3 animate-spin" />
                )}
                {status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{step.blurb}</p>
            <p className="mt-3 text-xs tabular-nums text-zinc-500">
              {tp.done}/{tp.total} lessons
            </p>
            {locked && (
              <p className="mt-2 text-xs text-amber-200/80">
                Unlocks after {UNLOCK_LESSON}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
