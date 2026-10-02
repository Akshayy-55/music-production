"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ensureAudio, Tone } from "@/lib/tone-helpers";
import { createStudioKit, secondsPerBar, stopTransport, type StudioKit } from "@/lib/studio-kit";
import { CLUB_MAP, coachAt, sectionAt } from "@/lib/guided-tracks";
import { GearChassis } from "@/components/gear/GearChassis";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";

type Tab = "watch" | "phrases" | "energy";

function EnergyCurve({ bar }: { bar: number }) {
  const w = 320;
  const h = 72;
  const pts = CLUB_MAP.sections.map((s) => {
    const x = ((s.startBar + s.bars / 2) / CLUB_MAP.bars) * w;
    const y = h - 8 - s.energy * (h - 16);
    return `${x},${y}`;
  });
  const playX = (Math.min(CLUB_MAP.bars, bar) / CLUB_MAP.bars) * w;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
      <polyline
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        points={pts.join(" ")}
      />
      {CLUB_MAP.sections.map((s) => {
        const x = ((s.startBar + s.bars / 2) / CLUB_MAP.bars) * w;
        const y = h - 8 - s.energy * (h - 16);
        return (
          <circle key={s.id} cx={x} cy={y} r="3.5" fill="#a78bfa" />
        );
      })}
      <line
        x1={playX}
        x2={playX}
        y1="0"
        y2={h}
        stroke="white"
        strokeWidth="1.5"
        opacity="0.7"
      />
    </svg>
  );
}

export function SongMap({
  lessonId,
  defaultTab = "watch",
}: {
  lessonId?: string;
  defaultTab?: Tab;
}) {
  const { markChecklist } = useProgress();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [playing, setPlaying] = useState(false);
  const [bar, setBar] = useState(0);
  const [taps, setTaps] = useState<number[]>([]);
  const [quiz, setQuiz] = useState<(number | null)[]>(
    CLUB_MAP.questions.map(() => null)
  );
  const [revealed, setRevealed] = useState(false);
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const kitRef = useRef<StudioKit | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
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
    const b = Tone.getTransport().seconds / secondsPerBar(CLUB_MAP.bpm);
    setBar(Math.min(CLUB_MAP.bars, Math.max(0, b)));
    const sec = sectionAt(CLUB_MAP.sections, Math.floor(b));
    if (sec) setVisited((v) => ({ ...v, [sec.id]: true }));
    if (b >= CLUB_MAP.bars) {
      stop();
      setBar(CLUB_MAP.bars);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [stop]);

  const playFrom = useCallback(
    async (startBar: number) => {
      await ensureAudio();
      if (!kitRef.current) kitRef.current = createStudioKit();
      stop();
      Tone.getTransport().bpm.value = CLUB_MAP.bpm;
      CLUB_MAP.schedule(kitRef.current);
      Tone.getTransport().scheduleOnce(() => {
        stop();
        setBar(CLUB_MAP.bars);
      }, `${CLUB_MAP.bars}:0:0`);
      Tone.getTransport().position = `${startBar}:0:0`;
      Tone.getTransport().start();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [stop, tick]
  );

  const coach = coachAt(CLUB_MAP.coach, Math.floor(bar));
  const section = sectionAt(CLUB_MAP.sections, Math.floor(bar));
  const expectedPhrases = CLUB_MAP.sections.filter((s) => s.bars >= 8).length;
  const allVisited = CLUB_MAP.sections.every((s) => visited[s.id]);

  useEffect(() => {
    if (!lessonId) return;
    if (allVisited) {
      if (lessonId === "m3.l2") markChecklist(lessonId, 0);
      if (lessonId === "m3.l1") markChecklist(lessonId, 0);
      if (lessonId === "m3.l3") markChecklist(lessonId, 0);
    }
    if (visited.drop && lessonId === "m3.l3") markChecklist(lessonId, 1);
  }, [allVisited, lessonId, markChecklist, visited.drop]);

  const allAnswered = quiz.every((p) => p !== null);
  const quizOk = quiz.every((p, i) => p === CLUB_MAP.questions[i].answer);

  return (
    <GearChassis plate="BeatPath MAP-36 · arrangement">
      <p className="mb-4 text-sm text-zinc-400">
        One original 36-bar house sketch at 122 BPM. Intro → groove → break →
        drop → outro. Jump any section. Nothing to download.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["watch", "Watch sections"],
            ["phrases", "Tap phrases"],
            ["energy", "Energy curve"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              tab === id
                ? "bg-cyan-500 text-zinc-950"
                : "border border-zinc-600 text-zinc-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-zinc-800">
        {CLUB_MAP.sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => playFrom(s.startBar)}
            className={cn("h-full", s.color)}
            style={{ width: `${(s.bars / CLUB_MAP.bars) * 100}%` }}
            title={`Jump to ${s.label}`}
          />
        ))}
      </div>
      <div className="relative mb-4 h-1">
        <div
          className="absolute top-0 h-3 w-0.5 -translate-y-3 bg-white"
          style={{
            left: `${Math.min(100, (bar / CLUB_MAP.bars) * 100)}%`,
          }}
        />
      </div>
      <div className="mb-4 flex text-[10px] uppercase tracking-wide text-zinc-500">
        {CLUB_MAP.sections.map((s) => (
          <span
            key={s.id}
            className="truncate pr-1"
            style={{ width: `${(s.bars / CLUB_MAP.bars) * 100}%` }}
          >
            {s.label}
            {s.bars >= 8 ? " · 8" : " · 4"}
          </span>
        ))}
      </div>

      {tab === "energy" && (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
          <EnergyCurve bar={bar} />
          <p className="mt-1 text-xs text-zinc-500">
            Low → high: intro, groove, hole, peak, fade. Sketch this shape on
            any reference later.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          {tab === "phrases" ? "How to tap" : "What is happening"}
        </p>
        <p className="mt-1 text-sm font-medium text-white">
          {tab === "phrases"
            ? "Tap when a new phrase starts"
            : (coach?.title ?? "Press play")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">
          {tab === "phrases"
            ? "A phrase feels like a sentence restart — often every 8 bars. Tap New phrase on those hits. We expect 4 main 8-bar phrases plus a short outro."
            : (coach?.body ??
              "Play from the start, or tap a colored block to jump.")}
        </p>
        {section && tab !== "phrases" && (
          <p className="mt-2 text-xs text-zinc-500">
            Now: {section.label} · bar {Math.min(CLUB_MAP.bars, Math.floor(bar) + 1)} /{" "}
            {CLUB_MAP.bars}
          </p>
        )}
      </div>

      {tab === "phrases" && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!playing) return;
              setTaps((t) => [...t, bar]);
            }}
            disabled={!playing}
            className="rounded-xl border border-amber-400/50 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-100 disabled:opacity-40"
          >
            New phrase
          </button>
          <p className="text-xs text-zinc-400">
            Taps: {taps.length} · target ≈ {expectedPhrases} (plus outro)
          </p>
          {taps.length > 0 && (
            <button
              type="button"
              onClick={() => setTaps([])}
              className="text-xs text-zinc-500 underline"
            >
              Clear taps
            </button>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => (playing ? stop() : playFrom(0))}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500"
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4" /> Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play map
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            stop();
            setBar(0);
            setTaps([]);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="mt-5 space-y-3 rounded-xl border border-zinc-700/80 bg-zinc-950/60 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          Check the map
        </p>
        {CLUB_MAP.questions.map((q, qi) => (
          <div key={q.q}>
            <p className="text-sm font-medium text-zinc-100">{q.q}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setRevealed(false);
                    setQuiz((prev) => {
                      const next = [...prev];
                      next[qi] = oi;
                      return next;
                    });
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    quiz[qi] === oi
                      ? "border-violet-400 bg-violet-500/15 text-white"
                      : "border-zinc-700 text-zinc-300"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            {revealed && (
              <p className="mt-1 text-xs text-zinc-400">{q.why}</p>
            )}
          </div>
        ))}
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => {
            setRevealed(true);
            if (quizOk && lessonId) {
              if (lessonId === "m3.l2") {
                markChecklist(lessonId, 1);
                markChecklist(lessonId, 2);
              }
              if (lessonId === "m3.l1") markChecklist(lessonId, 1);
            }
          }}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-40"
        >
          Reveal answers
        </button>
        {revealed && quizOk && (
          <p className="text-xs text-emerald-300">
            Map locked in. The longest mix-friendly stretch here is the 8-bar
            intro (and the 4-bar outro).
          </p>
        )}
      </div>
    </GearChassis>
  );
}
