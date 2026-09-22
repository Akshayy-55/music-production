import { TodayCard } from "@/components/TodayCard";
import { CourseModules } from "@/components/CourseModules";
import { CertificateCard } from "@/components/CertificateCard";
import Link from "next/link";
import { PRACTICE_TOOLS, lessonCount } from "@/lib/curriculum";

export default function HomePage() {
  const mixer = PRACTICE_TOOLS.find((t) => t.id === "mixer")!;
  const others = PRACTICE_TOOLS.filter((t) => t.id !== "mixer");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <TodayCard />

      <section className="mt-10">
        <CertificateCard />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Course modules</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {lessonCount()} lessons across Shared, DJ, and Production — rings
              show progress on this device.
            </p>
          </div>
          <Link href="/path" className="text-sm font-medium text-violet-300 hover:text-violet-200">
            Visual roadmap →
          </Link>
        </div>
        <CourseModules />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-100">Booth & studio tools</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Practice on gear-shaped surfaces.{" "}
          <strong className="font-medium text-zinc-400">BPM</strong> = beats per
          minute; you&apos;ll meet it in week one.
        </p>
        <Link
          href={mixer.href}
          className="mt-4 block rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-violet-950/30 p-5 transition hover:border-cyan-400/50"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Featured booth
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">{mixer.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{mixer.description}</p>
          <p className="mt-3 text-sm font-medium text-cyan-200">
            Open the 2-channel mixer →
          </p>
        </Link>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((t) => (
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
      </section>
    </div>
  );
}
