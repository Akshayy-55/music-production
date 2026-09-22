import glossary from "@/content/glossary.json";
import Link from "next/link";

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) =>
    a.term.localeCompare(b.term, "en")
  );
  const letters = [...new Set(sorted.map((g) => g.term[0].toUpperCase()))];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Glossary</h1>
      <p className="mt-2 text-zinc-400">
        {sorted.length} terms. Jargon defined once so lessons stay readable.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {letters.map((L) => (
          <a
            key={L}
            href={`#letter-${L}`}
            className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
          >
            {L}
          </a>
        ))}
      </div>
      <div className="mt-8 space-y-8">
        {letters.map((L) => (
          <section key={L} id={`letter-${L}`}>
            <h2 className="mb-3 text-lg font-semibold text-violet-300">{L}</h2>
            <dl className="space-y-4">
              {sorted
                .filter((g) => g.term[0].toUpperCase() === L)
                .map((g) => (
                  <div
                    key={g.term}
                    id={g.term}
                    className="scroll-mt-24 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
                  >
                    <dt className="font-semibold text-white">{g.term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {g.definition}
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/path" className="text-violet-300 hover:underline">
          Back to path
        </Link>
      </p>
    </div>
  );
}
