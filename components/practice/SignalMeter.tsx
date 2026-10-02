"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Pulses when a Transport-scheduled note actually fires (not just the playhead). */
export function SignalMeter() {
  const [hits, setHits] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let t = 0;
    const hit = () => {
      setHits((n) => n + 1);
      setOn(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setOn(false), 90);
    };
    window.addEventListener("beatpath-hit", hit);
    return () => {
      window.removeEventListener("beatpath-hit", hit);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <span
      data-note-hits={hits}
      className="inline-flex items-center gap-2 text-xs tabular-nums text-zinc-400"
    >
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full border border-emerald-800",
          on
            ? "bg-emerald-400 shadow-[0_0_10px_#34d399]"
            : "bg-zinc-700"
        )}
      />
      {hits > 0 ? `${hits} notes fired` : "waiting for notes"}
    </span>
  );
}
