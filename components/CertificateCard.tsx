"use client";

import { Award } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { UNLOCK_LESSON } from "@/lib/types";
import { isLessonComplete } from "@/lib/progress";

export function CertificateCard() {
  const { progress, ready } = useProgress();
  if (!ready) return null;
  const earned = isLessonComplete(progress, UNLOCK_LESSON);
  if (!earned) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-950/50 via-zinc-950 to-violet-950/40 p-5 shadow-xl shadow-amber-950/20">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-500/15 text-amber-200">
          <Award className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/80">
            Earned
          </p>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
            Certificate of Shared Fundamentals
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            You finished the Shared exam ({UNLOCK_LESSON}). DJ and Production
            tracks are unlocked — same booth, new modules.
          </p>
        </div>
      </div>
    </div>
  );
}
