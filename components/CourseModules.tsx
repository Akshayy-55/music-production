"use client";

import Link from "next/link";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { moduleProgress } from "@/lib/progress";
import { getModules, isTrackLocked } from "@/lib/curriculum";
import { TrackBadge } from "./TrackBadge";
import { ProgressRing } from "./ProgressRing";
import { UNLOCK_LESSON } from "@/lib/types";

export function CourseModules() {
  const { progress, ready } = useProgress();
  if (!ready) {
    return <div className="h-48 animate-pulse rounded-2xl bg-zinc-900/50" />;
  }

  const modules = getModules();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {modules.map((mod) => {
        const mp = moduleProgress(progress, mod.id);
        const locked = isTrackLocked(mod.track, progress.completedLessons);
        const status =
          locked ? "Locked" : mp.percent === 100 ? "Done" : mp.done > 0 ? "In progress" : "Not started";
        const href = locked ? "/path" : `/modules/${mod.id}`;
        return (
          <Link
            key={mod.id}
            href={href}
            onClick={(e) => {
              if (locked) e.preventDefault();
            }}
            className={`group rounded-2xl border p-4 transition ${
              locked
                ? "cursor-not-allowed border-zinc-800/70 bg-zinc-950/40 opacity-70"
                : "border-zinc-800 bg-zinc-900/50 hover:border-violet-500/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <ProgressRing percent={mp.percent} size={52} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <TrackBadge track={mod.track} />
                  <span className="text-[11px] text-zinc-500">{status}</span>
                </div>
                <h3 className="mt-1 font-semibold text-zinc-50 group-hover:text-white">
                  {mod.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{mod.description}</p>
                <p className="mt-2 text-[11px] tabular-nums text-zinc-500">
                  {mp.total} lessons · ~{mod.estimatedHours}h · {mp.done}/{mp.total}
                </p>
              </div>
              {locked ? (
                <Lock className="h-4 w-4 shrink-0 text-zinc-600" />
              ) : mp.percent === 100 ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-violet-300" />
              )}
            </div>
            {locked && (
              <p className="mt-2 text-[11px] text-amber-200/80">
                Finish Shared exam ({UNLOCK_LESSON}) to open this track.
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
