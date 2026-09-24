"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// Quiz uses the same hooks.
import { Pause, Play, RotateCcw } from "lucide-react";
import { ensureAudio, Tone } from "@/lib/tone-helpers";
import { createStudioKit, secondsPerBar, stopTransport, type StudioKit } from "@/lib/studio-kit";
import {
  LISTEN_SAMPLES,
  coachAt,
  sectionAt,
  type ListenSample,
} from "@/lib/guided-tracks";
import { GearChassis } from "@/components/gear/GearChassis";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";

const FEEL_KEY = "beatpath-listen-feel";

function Timeline({
  sample,
  bar,
}: {
  sample: ListenSample;
  bar: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-800">
        {sample.sections.map((s) => (
          <div
            key={s.id}
            className={cn("relative h-full", s.color)}
            style={{ width: `${(s.bars / sample.bars) * 100}%` }}
            title={s.label}
          />
        ))}
      </div>
      <div
        className="relative h-1"
        aria-hidden
      >
        <div
          className="absolute top-0 h-3 w-0.5 -translate-y-3 bg-white shadow-[0_0_8px_white]"
          style={{
            left: `${Math.min(100, Math.max(0, (bar / sample.bars) * 100))}%`,
          }}
        />
      </div>
      <div className="flex text-[10px] uppercase tracking-wide text-zinc-500">
        {sample.sections.map((s) => (
          <span
            key={s.id}
            className="truncate pr-1"
            style={{ width: `${(s.bars / sample.bars) * 100}%` }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Quiz({
  sample,
  onPass,
}: {
  sample: ListenSample;
  onPass: () => void;
}) {
  const [picks, setPicks] = useState<(number | null)[]>(
    sample.questions.map(() => null)
  );
  const [revealed, setRevealed] = useState(false);
  const passed = useRef(false);

  const allAnswered = picks.every((p) => p !== null);
  const correct = picks.every((p, i) => p === sample.questions[i].answer);

  useEffect(() => {
    if (revealed && correct && !passed.current) {
      passed.current = true;
      onPass();
    }
  }, [revealed, correct, onPass]);

  return (
    <div className="mt-5 space-y-4 rounded-xl border border-zinc-700/80 bg-zinc-950/60 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
        Check what you heard
      </p>
      {sample.questions.map((q, qi) => (
        <div key={q.q}>
          <p className="text-sm font-medium text-zinc-100">{q.q}</p>
          <div className="mt-2 flex flex-col gap-2">
            {q.options.map((opt, oi) => {
              const selected = picks[qi] === oi;
              const show = revealed && selected;
              const right = oi === q.answer;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setRevealed(false);
                    setPicks((prev) => {
                      const next = [...prev];
                      next[qi] = oi;
                      return next;
                    });
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm",
                    selected
                      ? "border-violet-400 bg-violet-500/15 text-white"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500",
                    show && right && "border-emerald-400 bg-emerald-500/15",
                    show && !right && "border-rose-400/70 bg-rose-950/40"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {revealed && (
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {q.why}
            </p>
          )}
        </div>
      ))}
      <button
        type="button"
        disabled={!allAnswered}
        onClick={() => setRevealed(true)}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-40"
      >
        {revealed ? (correct ? "Nailed it" : "Check again") : "Reveal answers"}
      </button>
      {revealed && !correct && (
        <p className="text-xs text-amber-200">
          Replay the clip, then change any wrong answer. The why-text is the
          lesson.
        </p>
      )}
    </div>
  );
}

export function ListenMaker({
  lessonId,
}: {
  lessonId?: string;
}) {
  const { markChecklist } = useProgress();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [bar, setBar] = useState(0);
  const [heard, setHeard] = useState<Record<string, boolean>>({});
  const [feel, setFeel] = useState("");
  const kitRef = useRef<StudioKit | null>(null);
  const rafRef = useRef(0);
  const sample = LISTEN_SAMPLES[index];

  useEffect(() => {
    try {
      setFeel(localStorage.getItem(FEEL_KEY) ?? "");
    } catch {
      /* ignore */
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      stopTransport();
      kitRef.current?.dispose();
      kitRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stopTransport();
    setPlaying(false);
  }, []);

  const tick = useCallback(() => {
    const bpm = LISTEN_SAMPLES[index].bpm;
    const bars = LISTEN_SAMPLES[index].bars;
    const b = Tone.getTransport().seconds / secondsPerBar(bpm);
    setBar(Math.min(bars, Math.max(0, b)));
    if (b >= bars) {
      stop();
      setBar(bars);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [index, stop]);

  const play = useCallback(async () => {
    await ensureAudio();
    if (!kitRef.current) kitRef.current = createStudioKit();
    stop();
    const s = LISTEN_SAMPLES[index];
    Tone.getTransport().bpm.value = s.bpm;
    s.schedule(kitRef.current);
    Tone.getTransport().scheduleOnce(() => {
      stop();
      setBar(s.bars);
    }, `${s.bars}:0:0`);
    Tone.getTransport().start();
    setPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [index, stop, tick]);

  const select = (i: number) => {
    stop();
    setBar(0);
    setIndex(i);
  };

  const coach = coachAt(sample.coach, Math.floor(bar));
  const section = sectionAt(sample.sections, Math.floor(bar));

  const onPass = (id: string, checklistIndex: number) => {
    setHeard((h) => ({ ...h, [id]: true }));
    if (lessonId) markChecklist(lessonId, checklistIndex);
  };

  const onFeel = (value: string) => {
    setFeel(value);
    try {
      localStorage.setItem(FEEL_KEY, value);
    } catch {
      /* ignore */
    }
    if (lessonId && value.trim().length >= 12) {
      markChecklist(lessonId, 3);
    }
  };

  return (
    <GearChassis plate="BeatPath LISTEN-3 · studio clips">
      <p className="mb-4 text-sm text-zinc-400">
        Three original clips (Tone.js — not commercial songs). Press play, follow
        the coach, then answer. You do not pick audio.
      </p>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {LISTEN_SAMPLES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => select(i)}
            className={cn(
              "rounded-xl border px-3 py-3 text-left",
              i === index
                ? "border-violet-400 bg-violet-500/15"
                : "border-zinc-700 bg-zinc-950/40 hover:border-zinc-500"
            )}
          >
            <p className="text-sm font-semibold text-white">{s.title}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {s.feel} · {s.bpm} BPM
            </p>
            {heard[s.id] && (
              <p className="mt-1 text-[10px] uppercase tracking-wide text-emerald-300">
                Heard
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white">{sample.title}</h3>
            <p className="text-xs text-zinc-500">{sample.vibe}</p>
          </div>
          <p className="text-xs tabular-nums text-zinc-500">
            Bar {Math.min(sample.bars, Math.floor(bar) + (bar >= sample.bars ? 0 : 1))} /{" "}
            {sample.bars}
            {section ? ` · ${section.label}` : ""}
          </p>
        </div>

        <Timeline sample={sample} bar={bar} />

        <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            What to do now
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            {coach?.title ?? "Press play"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-300">
            {coach?.body ??
              "Listen once for speed. On the second pass, watch the timeline for the marked change."}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (playing ? stop() : play())}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500"
          >
            {playing ? (
              <>
                <Pause className="h-4 w-4" /> Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Play sample
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              stop();
              setBar(0);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        <Quiz
          key={sample.id}
          sample={sample}
          onPass={() => onPass(sample.id, index)}
        />
      </div>

      <label className="mt-5 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          One sentence — the feel you want
        </span>
        <textarea
          value={feel}
          onChange={(e) => onFeel(e.target.value)}
          rows={2}
          placeholder="e.g. Warm late-night bounce, like Night Bus, with one clear lift."
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
      </label>
    </GearChassis>
  );
}
