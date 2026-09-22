import { PathOverview } from "@/components/PathOverview";

export default function PathPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Learning path</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Shared fundamentals first (listening, pulse, EQ, phrasing). Then unlock
        DJ and Production. Soft-lock: finish lesson{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-violet-300">
          m3.l5
        </code>{" "}
        to open DJ/Prod modules.
      </p>
      <div className="mt-8">
        <PathOverview />
      </div>
    </div>
  );
}
