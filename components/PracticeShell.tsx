import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PracticeShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/practice"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" /> All practice tools
      </Link>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 text-zinc-400">{description}</p>
      <p className="mt-2 text-xs text-zinc-500">
        Tap Start / Play once to unlock audio (browser gesture required).
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
