"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Disc3 } from "lucide-react";
import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { getNextIncompleteLesson, overallProgress } from "@/lib/progress";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Today" },
  { href: "/path", label: "Path" },
  { href: "/practice", label: "Practice" },
  { href: "/glossary", label: "Glossary" },
  { href: "/gear", label: "Gear" },
  { href: "/software", label: "Software" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { progress, ready } = useProgress();
  const [open, setOpen] = useState(false);
  const pct = ready ? overallProgress(progress) : 0;
  const nextId = ready ? getNextIncompleteLesson(progress) : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-zinc-950">
            <Disc3 className="h-4 w-4" />
          </span>
          <span>BeatPath</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm transition",
                pathname === l.href ||
                  (l.href !== "/" && pathname.startsWith(l.href))
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {nextId && (
            <Link
              href={`/lessons/${nextId}`}
              className="hidden rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 sm:inline-flex"
            >
              Continue
            </Link>
          )}
          <div className="hidden w-28 flex-col gap-1 sm:flex">
            <div className="flex justify-between text-[10px] uppercase tracking-wide text-zinc-500">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <ProgressBar percent={pct} size="sm" />
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-zinc-800 px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
            <span>Overall progress</span>
            <span>{pct}%</span>
          </div>
          <ProgressBar percent={pct} className="mb-3" size="sm" />
          {nextId && (
            <Link
              href={`/lessons/${nextId}`}
              onClick={() => setOpen(false)}
              className="mb-3 flex items-center justify-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Continue lesson
            </Link>
          )}
          <ul className="grid grid-cols-2 gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm",
                    pathname === l.href
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-300 hover:bg-zinc-900"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
