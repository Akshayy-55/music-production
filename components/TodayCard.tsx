"use client";

import Link from "next/link";
import { ArrowRight, Flame, Timer } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import {
  getNextIncompleteLesson,
  overallProgress,
  pickDrill,
} from "@/lib/progress";
import { getLesson, PRACTICE_TOOLS } from "@/lib/curriculum";
import { TrackBadge } from "./TrackBadge";
import { ProgressBar } from "./ProgressBar";
import { ProgressRing } from "./ProgressRing";

export function TodayCard() {
  const { progress, ready, setFocusTrack } = useProgress();
  if (!ready) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" />
    );
  }

  const nextId = getNextIncompleteLesson(progress);
  const next = nextId ? getLesson(nextId) : undefined;
  const drillId = pickDrill(progress);
  const drill = PRACTICE_TOOLS.find((t) => t.id === drillId)!;
  const pct = overallProgress(progress);
  const lessonMins = next?.estimatedMinutes ?? 20;
  const totalMins = lessonMins + drill.minutes;
  const streakHot = progress.streak.count > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-violet-950/50 p-5 shadow-xl shadow-violet-950/30 sm:p-7">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300/90">
              Today&apos;s Practice
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Continue your course
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              A real path: lesson → drill → checklist. About {totalMins} minutes.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 ${
              streakHot
                ? "border-orange-400/40 bg-orange-500/15 text-orange-100 shadow-[0_0_24px_rgba(249,115,22,0.15)]"
                : "border-zinc-700 bg-zinc-900 text-zinc-400"
            }`}
          >
            <Flame className={`h-5 w-5 ${streakHot ? "text-orange-400" : ""}`} />
            <div>
              <p className="text-lg font-bold tabular-nums leading-none">
                {progress.streak.count}
              </p>
              <p className="text-[10px] uppercase tracking-wider">
                day streak
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-4">
          <ProgressRing percent={pct} size={64} />
          <div className="min-w-[180px] flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" /> ~{totalMins} min block
              </span>
              <span className="tabular-nums">{pct}% of course</span>
            </div>
            <ProgressBar percent={pct} />
          </div>
        </div>

        {next ? (
          <Link
            href={`/lessons/${next.id}`}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500"
          >
            Continue: {next.title}
            <ArrowRight className="h-5 w-5" />
          </Link>
        ) : (
          <p className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
            All lessons complete — revisit the mixer or a capstone.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Next lesson
            </p>
            {next ? (
              <>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TrackBadge track={next.track} />
                  <span className="text-xs text-zinc-500">
                    {next.estimatedMinutes} min
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-zinc-50">
                  {next.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                  {next.summary}
                </p>
                {next.practiceTools.some((t) =>
                  ["listen-maker", "song-map"].includes(t)
                ) && (
                  <p className="mt-2 text-xs text-cyan-300/90">
                    Guided studio clips are inside this lesson — you do not pick
                    songs.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-zinc-300">Path finished on this device.</p>
            )}
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-zinc-950/50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Rotating drill
            </p>
            <h2 className="mt-2 text-lg font-semibold text-zinc-50">
              {drill.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">{drill.description}</p>
            <p className="mt-2 text-xs text-zinc-500">~{drill.minutes} min</p>
            <Link
              href={drill.href}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-200 hover:bg-cyan-500/20"
            >
              Open drill <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="mb-3 text-sm font-medium text-zinc-300">
          Focus after Shared exam
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["shared", "Shared"],
              ["dj", "DJ"],
              ["production", "Production"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFocusTrack(id)}
              className={
                progress.focusTrack === id
                  ? "rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900"
                  : "rounded-full border border-zinc-700 px-4 py-1.5 text-sm text-zinc-400 hover:border-zinc-500"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          DJ & Production stay soft-locked until you finish lesson m3.l5
          (Shared fundamentals exam).
        </p>
      </div>
    </div>
  );
}
