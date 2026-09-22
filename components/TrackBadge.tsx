import { cn } from "@/lib/utils";
import type { TrackId } from "@/lib/types";

const styles: Record<TrackId, string> = {
  shared: "bg-violet-500/20 text-violet-300 ring-violet-500/30",
  dj: "bg-cyan-500/20 text-cyan-300 ring-cyan-500/30",
  production: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
};

const labels: Record<TrackId, string> = {
  shared: "Shared",
  dj: "DJ",
  production: "Production",
};

export function TrackBadge({
  track,
  className,
}: {
  track: TrackId;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[track],
        className
      )}
    >
      {labels[track]}
    </span>
  );
}
