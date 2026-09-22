import software from "@/content/software.json";

function Matrix({
  title,
  rows,
}: {
  title: string;
  rows: typeof software.dj;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Platforms</th>
              <th className="px-4 py-3">Best for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-zinc-800">
                <td className="px-4 py-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-cyan-300 hover:underline"
                  >
                    {r.name}
                  </a>
                  <p className="mt-0.5 text-xs text-zinc-500">{r.notes}</p>
                </td>
                <td className="px-4 py-3 text-zinc-300">{r.price}</td>
                <td className="px-4 py-3 text-zinc-400">{r.platforms}</td>
                <td className="px-4 py-3 text-zinc-400">{r.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function SoftwarePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white">Software comparison</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Pick one DJ app and one DAW for 30 days. Concepts transfer — tool
        hopping does not.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-400">
        {software.advice.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <Matrix title="DJ software" rows={software.dj} />
      <Matrix title="DAWs & editors" rows={software.daw} />
    </div>
  );
}
