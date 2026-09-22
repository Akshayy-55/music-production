"use client";

import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { isLessonComplete, moduleProgress } from "@/lib/progress";
import {
  curriculum,
  getModulesByTrack,
  isTrackLocked,
} from "@/lib/curriculum";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";
import { TrackBadge } from "./TrackBadge";
import { UNLOCK_LESSON } from "@/lib/types";
import type { TrackId } from "@/lib/types";

export function PathOverview() {
  const { progress, ready } = useProgress();
  if (!ready) {
    return <div className="h-96 animate-pulse rounded-2xl bg-zinc-900/50" />;
  }

  const unlocked = progress.completedLessons.includes(UNLOCK_LESSON);

  return (
    <div className="space-y-10">
      {curriculum.tracks.map((track) => {
        const locked = isTrackLocked(
          track.id as TrackId,
          progress.completedLessons
        );
        const modules = getModulesByTrack(track.id as TrackId);
        return (
          <section key={track.id}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <TrackBadge track={track.id as TrackId} />
              <h2 className="text-xl font-semibold text-white">{track.title}</h2>
              {locked && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-200">
                  <Lock className="h-3 w-3" /> Finish Shared exam ({UNLOCK_LESSON})
                </span>
              )}
              {!locked && track.id !== "shared" && unlocked && (
                <span className="text-xs text-emerald-400">Unlocked</span>
              )}
            </div>
            <p className="mb-4 text-sm text-zinc-400">{track.description}</p>
            <div className="space-y-3">
              {modules.map((mod) => {
                const mp = moduleProgress(progress, mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`rounded-xl border p-4 ${
                      locked
                        ? "border-zinc-800/80 bg-zinc-950/40 opacity-70"
                        : "border-zinc-800 bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <ProgressRing percent={mp.percent} size={48} />
                        <div>
                          <Link
                            href={`/modules/${mod.id}`}
                            className="font-medium text-zinc-100 hover:text-violet-300"
                          >
                            {mod.title}
                          </Link>
                          <p className="mt-1 text-sm text-zinc-500">
                            {mod.description}
                          </p>
                          <p className="mt-1 text-xs tabular-nums text-zinc-600">
                            {mp.total} lessons · ~{mod.estimatedHours}h
                          </p>
                        </div>
                      </div>
                      <span className="text-xs tabular-nums text-zinc-500">
                        {mp.done}/{mp.total}
                      </span>
                    </div>
                    <ProgressBar percent={mp.percent} size="sm" className="mt-3" />
                    <ul className="mt-3 space-y-1">
                      {mod.lessons.map((l, i) => {
                        const done = isLessonComplete(progress, l.id);
                        return (
                          <li key={l.id}>
                            <Link
                              href={locked ? "/path" : `/lessons/${l.id}`}
                              className={`flex items-center gap-2 text-sm ${
                                locked
                                  ? "cursor-not-allowed text-zinc-600"
                                  : "text-zinc-300 hover:text-white"
                              }`}
                              onClick={(e) => {
                                if (locked) e.preventDefault();
                              }}
                              title={
                                locked
                                  ? `Finish Shared exam (${UNLOCK_LESSON}) first`
                                  : undefined
                              }
                            >
                              {done ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              ) : locked ? (
                                <Lock className="h-3.5 w-3.5 text-zinc-600" />
                              ) : (
                                <span className="h-3.5 w-3.5 rounded-full border border-zinc-600" />
                              )}
                              <span className="w-8 shrink-0 text-[11px] text-zinc-600">
                                {i + 1}/{mod.lessons.length}
                              </span>
                              <span>{l.title}</span>
                              <span className="text-xs text-zinc-600">
                                {l.estimatedMinutes}m
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
