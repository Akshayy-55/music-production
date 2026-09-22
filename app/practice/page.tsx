import Link from "next/link";
import { PRACTICE_TOOLS } from "@/lib/curriculum";

export default function PracticeIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Practice tools</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Short drills powered by Tone.js in your browser. Tap play once to unlock
        audio. Pair these with lesson checklists on Today&apos;s Practice.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PRACTICE_TOOLS.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-violet-500/40 hover:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-white">{t.title}</h2>
            <p className="mt-1 text-sm text-zinc-400">{t.description}</p>
            <p className="mt-3 text-xs text-zinc-600">~{t.minutes} min</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
