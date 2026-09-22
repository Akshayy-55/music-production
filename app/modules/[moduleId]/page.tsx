import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getModules } from "@/lib/curriculum";
import { TrackBadge } from "@/components/TrackBadge";
import { ModuleLessons } from "@/components/ModuleLessons";

export function generateStaticParams() {
  return getModules().map((m) => ({ moduleId: m.id }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/path" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← Path
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TrackBadge track={mod.track} />
        <span className="text-xs text-zinc-500">~{mod.estimatedHours} hours</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-white">{mod.title}</h1>
      <p className="mt-2 text-zinc-400">{mod.description}</p>
      <p className="mt-2 text-sm text-zinc-500">
        {mod.lessons.length} lessons in this module
      </p>
      <ModuleLessons moduleId={mod.id} lessons={mod.lessons} track={mod.track} />
    </div>
  );
}
