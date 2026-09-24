import Link from "next/link";
import { PRACTICE_TOOLS } from "@/lib/curriculum";

export default function PracticeIndexPage() {
  const mixer = PRACTICE_TOOLS.find((t) => t.id === "mixer")!;
  const listen = PRACTICE_TOOLS.find((t) => t.id === "listen-maker")!;
  const rest = PRACTICE_TOOLS.filter(
    (t) => t.id !== "mixer" && t.id !== "listen-maker"
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Practice tools</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Booth and studio drills powered by Tone.js. Tap play once to unlock
        audio. Pair these with lesson checklists on Today&apos;s Practice.
      </p>

      <Link
        href={mixer.href}
        className="mt-8 block rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-zinc-900 via-cyan-950/30 to-violet-950/40 p-6 transition hover:border-cyan-400/50"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Club mixer
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-white">{mixer.title}</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">{mixer.description}</p>
        <p className="mt-3 text-xs text-zinc-500">~{mixer.minutes} min · two looping decks</p>
        <p className="mt-4 text-sm font-medium text-cyan-200">Step up to the booth →</p>
      </Link>

      <Link
        href={listen.href}
        className="mt-4 block rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zinc-900 via-violet-950/30 to-zinc-950 p-6 transition hover:border-violet-400/50"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300">
          Guided listening
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-white">{listen.title}</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">{listen.description}</p>
        <p className="mt-3 text-xs text-zinc-500">
          ~{listen.minutes} min · original Tone.js clips, not commercial songs
        </p>
        <p className="mt-4 text-sm font-medium text-violet-200">Hear the three samples →</p>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {rest.map((t) => (
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
