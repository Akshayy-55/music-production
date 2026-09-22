import Link from "next/link";
import { Disc3 } from "lucide-react";
import type { TrackId } from "@/lib/types";

export function GearBlurb({ track }: { track: TrackId }) {
  if (track !== "dj") return null;
  return (
    <aside className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/40 to-zinc-950 p-4">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
        <Disc3 className="h-3.5 w-3.5" /> Booth practice
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        This lesson maps onto real mixer hardware: channel gain, 3-band EQ,
        faders, headphone cue, and the crossfader. Open the in-browser DJM-2
        and feel the same layout you will see in Mixxx or a club booth.
      </p>
      <Link
        href="/practice/mixer"
        className="mt-3 inline-flex text-sm font-medium text-cyan-200 hover:text-white"
      >
        Open 2-channel mixer →
      </Link>
    </aside>
  );
}
