import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">About BeatPath</h1>
      <p className="mt-4 text-lg leading-relaxed text-zinc-300">
        BeatPath is one hub from absolute beginner to your{" "}
        <strong className="text-white">first DJ set</strong> and{" "}
        <strong className="text-white">first finished track</strong>. Warm,
        concrete lessons. Practice tools in the browser. Progress on this device
        — no account for v1.
      </p>

      <section className="mt-8 space-y-3 text-zinc-400">
        <h2 className="text-lg font-semibold text-white">What it is</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>A stepwise curriculum (Shared → DJ | Production)</li>
          <li>Checklists + localStorage progress</li>
          <li>Tone.js drills: club mixer, metronome, beat pad, EQ, ear training</li>
          <li>India-friendly gear tiers in ₹ and free software first</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3 text-zinc-400">
        <h2 className="text-lg font-semibold text-white">What it isn&apos;t</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Not a full DAW or DJ app replacement</li>
          <li>Not a pirate link dump — free & legal resources only</li>
          <li>Not locked to Ableton/FL — concepts transfer</li>
          <li>Not shame for using Sync while you learn</li>
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 text-sm text-amber-100/90">
        <p className="font-semibold text-amber-200">Ethics</p>
        <p className="mt-2">
          Skills before spend. Protect your hearing. Prefer FOSS and official
          free tiers. Never crack plugins or unpaid course dumps. When you are
          ready, buy tools from the people who make them.
        </p>
      </section>

      <p className="mt-8 text-sm text-zinc-500">
        Edit the path in{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
          content/curriculum.json
        </code>
        .{" "}
        <Link href="/" className="text-violet-300 hover:underline">
          Start Today&apos;s Practice →
        </Link>
      </p>
    </div>
  );
}
