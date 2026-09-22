"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ensureAudio, Tone } from "@/lib/tone-helpers";
import { GearChassis } from "@/components/gear/GearChassis";

export function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const synthRef = useRef<Tone.Synth | null>(null);
  const tapTimes = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
      synthRef.current?.dispose();
    };
  }, []);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    setRunning(false);
    setBeat(0);
  }, []);

  const start = useCallback(async () => {
    await ensureAudio();
    if (!synthRef.current) {
      synthRef.current = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
      }).toDestination();
      synthRef.current.volume.value = -12;
    }
    Tone.getTransport().cancel();
    Tone.getTransport().bpm.value = bpm;
    let i = 0;
    Tone.getTransport().scheduleRepeat((time) => {
      const accent = i % 4 === 0;
      synthRef.current?.triggerAttackRelease(
        accent ? "C5" : "C4",
        "32n",
        time,
        accent ? 0.9 : 0.5
      );
      Tone.Draw.schedule(() => setBeat((i % 4) + 1), time);
      i++;
    }, "4n");
    Tone.getTransport().start();
    setRunning(true);
  }, [bpm]);

  useEffect(() => {
    if (running) {
      Tone.getTransport().bpm.value = bpm;
    }
  }, [bpm, running]);

  const tapTempo = () => {
    const now = performance.now();
    tapTimes.current.push(now);
    if (tapTimes.current.length > 6) tapTimes.current.shift();
    if (tapTimes.current.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimes.current.length; i++) {
        intervals.push(tapTimes.current[i] - tapTimes.current[i - 1]);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const next = Math.round(60000 / avg);
      setBpm(Math.max(60, Math.min(180, next)));
    }
  };

  return (
    <GearChassis plate="BeatPath CLK-1 · studio metronome">
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-4 w-4 rounded-full transition ${
              beat === n
                ? n === 1
                  ? "bg-violet-400 scale-125"
                  : "bg-cyan-400 scale-110"
                : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
      <p className="mt-6 text-center text-5xl font-bold tabular-nums text-white">
        {bpm}
        <span className="ml-2 text-lg font-medium text-zinc-500">BPM</span>
      </p>
      <input
        type="range"
        min={60}
        max={180}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="gear-slider mt-6 w-full accent-violet-500"
      />
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => (running ? stop() : start())}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500"
        >
          {running ? (
            <>
              <Pause className="h-5 w-5" /> Stop
            </>
          ) : (
            <>
              <Play className="h-5 w-5" /> Start
            </>
          )}
        </button>
        <button
          type="button"
          onClick={tapTempo}
          className="rounded-xl border border-zinc-600 px-6 py-3 font-medium text-zinc-200 hover:bg-zinc-800"
        >
          Tap tempo
        </button>
      </div>
    </GearChassis>
  );
}
