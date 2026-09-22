import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PracticeShell({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("mx-auto px-4 py-8", wide ? "max-w-6xl" : "max-w-3xl")}>
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
