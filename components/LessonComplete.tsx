"use client";

import { CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { isLessonComplete } from "@/lib/progress";

export function LessonComplete({
  lessonId,
  itemCount,
}: {
  lessonId: string;
  itemCount: number;
}) {
  const { progress, ready, completeLesson } = useProgress();
  const done = ready && isLessonComplete(progress, lessonId);
  const checked = progress.checklist[lessonId]?.filter(Boolean).length ?? 0;

  if (!ready) return null;

  if (done) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/25 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200">
          <CheckCircle2 className="h-4 w-4" /> Lesson complete — saved on this device
        </p>
        <span className="text-xs text-emerald-200/70">
          {itemCount}/{itemCount} checklist
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/60 px-4 py-3">
      <p className="text-sm text-zinc-400">
        {checked}/{itemCount} checklist items. Mark complete when you have done
        the work — it updates your streak.
      </p>
      <button
        type="button"
        onClick={() => completeLesson(lessonId)}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
      >
        Mark complete
      </button>
    </div>
  );
}
