import resources from "@/content/resources.json";
import { ExternalLink } from "lucide-react";

const SECTIONS = [
  { key: "shared", title: "Shared fundamentals" },
  { key: "dj", title: "DJ" },
  { key: "production", title: "Production" },
  { key: "general", title: "General" },
] as const;

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Resources</h1>
      <p className="mt-2 text-zinc-400">{resources.disclaimer}</p>

      {SECTIONS.map((s) => {
        const items = resources.bySkill[s.key] ?? [];
        if (items.length === 0) return null;
        return (
          <section key={s.key} className="mt-8">
            <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            <ul className="mt-3 space-y-2">
              {items.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-cyan-300 hover:border-cyan-500/40"
                  >
                    {r.title}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs text-zinc-600">{r.type}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
