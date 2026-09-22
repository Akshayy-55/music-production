"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import { ensureAudio, makeHat, makeKick, makeSnare, Tone } from "@/lib/tone-helpers";

type Row = "kick" | "snare" | "hat";
const STEPS = 16;
const empty = (): Record<Row, boolean[]> => ({
  kick: Array(STEPS).fill(false),
  snare: Array(STEPS).fill(false),
  hat: Array(STEPS).fill(false),
});

export function BeatPad() {
  const [grid, setGrid] = useState<Record<Row, boolean[]>>(() => {
    const g = empty();
    // default 4-on-floor + backbeat + hats
    [0, 4, 8, 12].forEach((i) => (g.kick[i] = true));
    [4, 12].forEach((i) => (g.snare[i] = true));
    for (let i = 0; i < STEPS; i += 2) g.hat[i] = true;
    return g;
  });
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const instruments = useRef<{
    kick: Tone.MembraneSynth;
    snare: Tone.NoiseSynth;
    hat: Tone.MetalSynth;
  } | null>(null);

  useEffect(() => {
    return () => {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
      instruments.current?.kick.dispose();
      instruments.current?.snare.dispose();
      instruments.current?.hat.dispose();
    };
  }, []);

  const toggle = (row: Row, i: number) => {
    setGrid((g) => {
      const next = { ...g, [row]: [...g[row]] };
      next[row][i] = !next[row][i];
      return next;
    });
  };

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    setRunning(false);
    setStep(-1);
  }, []);

  const start = useCallback(async () => {
    await ensureAudio();
    if (!instruments.current) {
      const kick = makeKick().toDestination();
      kick.volume.value = -6;
      const snare = makeSnare().toDestination();
      snare.volume.value = -8;
      const hat = makeHat().toDestination();
      hat.volume.value = -18;
      instruments.current = { kick, snare, hat };
    }
    Tone.getTransport().cancel();
    Tone.getTransport().bpm.value = bpm;
    Tone.getTransport().swing = swing;
    Tone.getTransport().swingSubdivision = "8n";
    let i = 0;
    Tone.getTransport().scheduleRepeat((time) => {
      const g = gridRef.current;
      const idx = i % STEPS;
      if (g.kick[idx]) instruments.current?.kick.triggerAttackRelease("C1", "8n", time);
      if (g.snare[idx]) instruments.current?.snare.triggerAttackRelease("16n", time);
      if (g.hat[idx]) instruments.current?.hat.triggerAttackRelease(200, "32n", time);
      Tone.Draw.schedule(() => setStep(idx), time);
      i++;
    }, "16n");
    Tone.getTransport().start();
    setRunning(true);
  }, [bpm, swing]);

  useEffect(() => {
    if (running) {
      Tone.getTransport().bpm.value = bpm;
      Tone.getTransport().swing = swing;
    }
  }, [bpm, swing, running]);

  const rows: { id: Row; label: string; color: string }[] = [
    { id: "kick", label: "Kick", color: "bg-violet-500" },
    { id: "snare", label: "Snare", color: "bg-cyan-500" },
    { id: "hat", label: "Hat", color: "bg-amber-400" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6">
      <div className="space-y-3 overflow-x-auto">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2 min-w-[320px]">
            <span className="w-14 shrink-0 text-xs font-medium text-zinc-400">
              {row.label}
            </span>
            <div className="grid flex-1 grid-cols-16 gap-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
              {grid[row.id].map((on, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(row.id, i)}
                  className={`aspect-square rounded-md border transition ${
                    on
                      ? `${row.color} border-transparent`
                      : "border-zinc-700 bg-zinc-800/80 hover:border-zinc-500"
                  } ${step === i ? "ring-2 ring-white/70" : ""} ${
                    i % 4 === 0 ? "outline outline-1 outline-zinc-600/40" : ""
                  }`}
                  aria-label={`${row.label} step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-zinc-400">
          BPM {bpm}
          <input
            type="range"
            min={80}
            max={160}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="mt-1 w-full accent-violet-500"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Swing {Math.round(swing * 100)}%
          <input
            type="range"
            min={0}
            max={70}
            value={Math.round(swing * 100)}
            onChange={(e) => setSwing(Number(e.target.value) / 100)}
            className="mt-1 w-full accent-cyan-500"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => (running ? stop() : start())}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500"
        >
          {running ? (
            <>
              <Pause className="h-4 w-4" /> Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setGrid(empty())}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
}
