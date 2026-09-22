"use client";

import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { isLessonComplete } from "@/lib/progress";
import { isTrackLocked } from "@/lib/curriculum";
import type { Lesson, TrackId } from "@/lib/types";

export function ModuleLessons({
  moduleId,
  lessons,
  track,
}: {
  moduleId: string;
  lessons: Lesson[];
  track: TrackId;
}) {
  const { progress, ready } = useProgress();
  const locked =
    ready && isTrackLocked(track, progress.completedLessons);

  return (
    <ul className="mt-8 space-y-2">
      {lessons.map((l, i) => {
        const done = ready && isLessonComplete(progress, l.id);
        return (
          <li key={l.id}>
            <Link
              href={locked ? "/path" : `/lessons/${l.id}`}
              onClick={(e) => locked && e.preventDefault()}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                locked
                  ? "cursor-not-allowed border-zinc-800/60 bg-zinc-950/40 text-zinc-600"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-violet-500/40"
              }`}
            >
              <span className="w-6 text-xs text-zinc-600">{i + 1}</span>
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : locked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-zinc-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-100">{l.title}</p>
                <p className="text-xs text-zinc-500">
                  {l.estimatedMinutes} min · {l.id}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
      <li className="sr-only">{moduleId}</li>
    </ul>
  );
}
