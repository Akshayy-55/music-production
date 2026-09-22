import { TodayCard } from "@/components/TodayCard";
import Link from "next/link";
import { PRACTICE_TOOLS, lessonCount } from "@/lib/curriculum";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <TodayCard />

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-100">Quick links</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {lessonCount()} lessons across Shared, DJ, and Production.{" "}
          <strong className="font-medium text-zinc-400">BPM</strong> = beats per
          minute; you&apos;ll meet it in week one.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_TOOLS.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-violet-500/40"
            >
              <p className="font-medium text-zinc-100">{t.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{t.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/path"
            className="text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            View full learning path →
          </Link>
        </div>
      </section>
    </div>
  );
}
