import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllLessons,
  getLesson,
  getModuleForLesson,
  getNextLesson,
  getPreviousLesson,
  toolHref,
} from "@/lib/curriculum";
import { TrackBadge } from "@/components/TrackBadge";
import { Checklist } from "@/components/Checklist";
import { Clock, ArrowRight, ArrowLeft, ExternalLink, Wrench } from "lucide-react";
import glossary from "@/content/glossary.json";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ lessonId: l.id }));
}

function GlossaryChips({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const hits = glossary
    .filter((g) => {
      const t = g.term.toLowerCase();
      return (
        lower.includes(t) ||
        lower.includes(t.replace("-", " ")) ||
        (t === "bpm" && lower.includes("bpm"))
      );
    })
    .slice(0, 8);
  if (hits.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {hits.map((g) => (
        <Link
          key={g.term}
          href={`/glossary#${encodeURIComponent(g.term)}`}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:border-violet-500/50"
          title={g.definition}
        >
          {g.term}
        </Link>
      ))}
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  const mod = getModuleForLesson(lessonId);
  const next = getNextLesson(lessonId);
  const prev = getPreviousLesson(lessonId);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        {mod && (
          <Link href={`/modules/${mod.id}`} className="hover:text-zinc-300">
            {mod.title}
          </Link>
        )}
        <span>·</span>
        <span>{lesson.id}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TrackBadge track={lesson.track} />
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3.5 w-3.5" /> {lesson.estimatedMinutes} min
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
        {lesson.title}
      </h1>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-300/90">
          In plain words
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          {lesson.summary}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-300/90">
          Why it matters
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
          {lesson.whyItMatters.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
          Try it now
        </h2>
        <h3 className="mt-2 text-lg font-semibold text-white">
          {lesson.exercise.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          ~{lesson.exercise.durationMinutes} min
        </p>
        <p className="mt-2 text-zinc-300">{lesson.exercise.description}</p>
        {lesson.practiceTools.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.practiceTools.map((t) => {
              const href = toolHref(t);
              if (!href) return null;
              return (
                <Link
                  key={t}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200 hover:bg-cyan-500/20"
                >
                  <Wrench className="h-3.5 w-3.5" /> Open {t}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-violet-300/90">
          Checklist
        </h2>
        <p className="mb-3 text-xs text-zinc-500">
          Check all items to mark this lesson complete. Saved on this device.
        </p>
        <Checklist lessonId={lesson.id} items={lesson.checklist} />
        <p className="mt-3 text-xs text-zinc-500">
          Checkpoint: {lesson.successCheckpoint}
        </p>
      </section>

      {lesson.resources.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-violet-300/90">
            Go deeper (free & legal)
          </h2>
          <ul className="space-y-2">
            {lesson.resources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
                >
                  {r.title}
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs text-zinc-600">{r.type}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-300/90">
          Glossary chips
        </h2>
        <GlossaryChips
          text={`${lesson.title} ${lesson.summary} ${lesson.whyItMatters.join(" ")} ${lesson.exercise.description}`}
        />
      </section>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-6">
        {prev ? (
          <Link
            href={`/lessons/${prev.id}`}
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Next: {next.title} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/path"
            className="text-sm text-violet-300 hover:text-violet-200"
          >
            Back to path →
          </Link>
        )}
      </nav>
    </article>
  );
}
