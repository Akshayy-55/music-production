import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          BeatPath — skills before spend. No piracy. Progress stays on your
          device.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-zinc-300">
            About
          </Link>
          <Link href="/resources" className="hover:text-zinc-300">
            Resources
          </Link>
        </div>
      </div>
    </footer>
  );
}
