import gear from "@/content/gear.json";

export default function GearPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Gear guide (India)</h1>
      <p className="mt-2 text-zinc-400">{gear.disclaimer}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {gear.principles.map((p) => (
          <li
            key={p}
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
          >
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-4">
        {gear.tiers.map((tier, i) => (
          <section
            key={tier.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">
                <span className="mr-2 text-zinc-600">{i + 1}.</span>
                {tier.title}
              </h2>
              <span className="text-sm tabular-nums text-cyan-300">
                {tier.range}
              </span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {tier.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-zinc-500">{tier.note}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
