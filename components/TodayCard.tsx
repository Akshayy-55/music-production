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

export function TodayCard() {
  const { progress, ready, setFocusTrack } = useProgress();
  if (!ready) {
    return (
      <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 h-64" />
    );
  }

  const nextId = getNextIncompleteLesson(progress);
  const next = nextId ? getLesson(nextId) : undefined;
  const drillId = pickDrill(progress);
  const drill = PRACTICE_TOOLS.find((t) => t.id === drillId)!;
  const pct = overallProgress(progress);
  const lessonMins = next?.estimatedMinutes ?? 20;
  const totalMins = lessonMins + drill.minutes;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/40 p-6 shadow-xl shadow-violet-950/20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-violet-300/80">
              Today&apos;s Practice
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your next 15–30 minutes
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm text-orange-200">
            <Flame className="h-4 w-4" />
            <span>
              {progress.streak.count} day
              {progress.streak.count === 1 ? "" : "s"} streak
            </span>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 text-sm text-zinc-400">
          <Timer className="h-4 w-4" />
          <span>~{totalMins} min block</span>
          <span className="text-zinc-600">·</span>
          <span>{pct}% overall</span>
        </div>
        <ProgressBar percent={pct} className="mb-6" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
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
                <Link
                  href={`/lessons/${next.id}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
                >
                  Start lesson <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="mt-2 text-zinc-300">
                All lessons complete — revisit tools or a capstone.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Drill
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
