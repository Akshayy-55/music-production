import { Lightbulb } from "lucide-react";

export function InstructorTip({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-2xl border border-violet-500/25 bg-violet-950/25 p-4">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
        <Lightbulb className="h-3.5 w-3.5" /> Instructor tip
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{children}</p>
    </aside>
  );
}
