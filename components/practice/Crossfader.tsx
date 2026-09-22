"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { ensureAudio, makeKick, Tone } from "@/lib/tone-helpers";
import { GearChassis } from "@/components/gear/GearChassis";

export function CrossfaderTool() {
  const [running, setRunning] = useState(false);
  const [xfade, setXfade] = useState(0); // -1 A .. 1 B
  const [killA, setKillA] = useState(false);
  const [killB, setKillB] = useState(false);
  const refs = useRef<{
    kickA: Tone.MembraneSynth;
    kickB: Tone.MembraneSynth;
    bassA: Tone.Synth;
    bassB: Tone.Synth;
    gainA: Tone.Gain;
    gainB: Tone.Gain;
    bassGainA: Tone.Gain;
    bassGainB: Tone.Gain;
    loop?: Tone.Loop;
  } | null>(null);

  const apply = useCallback(() => {
    if (!refs.current) return;
    // equal-power-ish crossfade
    const t = (xfade + 1) / 2; // 0..1
    const a = Math.cos(t * 0.5 * Math.PI);
    const b = Math.sin(t * 0.5 * Math.PI);
    refs.current.gainA.gain.value = a * 0.7;
    refs.current.gainB.gain.value = b * 0.7;
    refs.current.bassGainA.gain.value = killA ? 0 : 1;
    refs.current.bassGainB.gain.value = killB ? 0 : 1;
  }, [xfade, killA, killB]);

  useEffect(() => {
    apply();
  }, [apply]);

  useEffect(() => {
    return () => {
      refs.current?.loop?.stop();
      refs.current?.loop?.dispose();
      if (refs.current) {
        Object.values(refs.current).forEach((n) => {
          if (n && typeof (n as Tone.ToneAudioNode).dispose === "function") {
            (n as Tone.ToneAudioNode).dispose();
          }
        });
      }
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
    };
  }, []);

  const stop = () => {
    refs.current?.loop?.stop();
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    setRunning(false);
  };

  const start = async () => {
    await ensureAudio();
    if (!refs.current) {
      const gainA = new Tone.Gain(0.7).toDestination();
      const gainB = new Tone.Gain(0).toDestination();
      const bassGainA = new Tone.Gain(1);
      const bassGainB = new Tone.Gain(1);
      const kickA = makeKick();
      const kickB = makeKick();
      kickA.connect(gainA);
      kickB.connect(gainB);
      kickA.volume.value = -4;
      kickB.volume.value = -4;
      const bassA = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.2 },
      });
      const bassB = new Tone.Synth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.2 },
      });
      bassA.volume.value = -10;
      bassB.volume.value = -12;
      bassA.connect(bassGainA);
      bassGainA.connect(gainA);
      bassB.connect(bassGainB);
      bassGainB.connect(gainB);

      let i = 0;
      const loop = new Tone.Loop((time) => {
        kickA.triggerAttackRelease("C1", "8n", time);
        kickB.triggerAttackRelease("C1", "8n", time);
        if (i % 2 === 0) {
          bassA.triggerAttackRelease("C2", "8n", time);
          bassB.triggerAttackRelease("E2", "8n", time);
        }
        i++;
      }, "4n");

      refs.current = {
        kickA,
        kickB,
        bassA,
        bassB,
        gainA,
        gainB,
        bassGainA,
        bassGainB,
        loop,
      };
    }
    apply();
    Tone.getTransport().bpm.value = 124;
    refs.current.loop?.start(0);
    Tone.getTransport().start();
    setRunning(true);
  };

  return (
    <GearChassis plate="BeatPath XF-1 · blend & bass kill">
      <p className="mb-4 text-sm text-zinc-400">
        Two loops, one crossfader. Kill bass on the outgoing track before you
        bring the new bass in — that&apos;s an{" "}
        <strong className="text-zinc-200">EQ bass swap</strong>. Same strip as
        the full mixer, distilled.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setKillA((v) => !v)}
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            killA
              ? "border-rose-500/50 bg-rose-500/20 text-rose-200"
              : "border-zinc-600 text-zinc-300"
          }`}
        >
          Deck A bass {killA ? "KILLED" : "on"}
        </button>
        <button
          type="button"
          onClick={() => setKillB((v) => !v)}
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            killB
              ? "border-rose-500/50 bg-rose-500/20 text-rose-200"
              : "border-zinc-600 text-zinc-300"
          }`}
        >
          Deck B bass {killB ? "KILLED" : "on"}
        </button>
      </div>

      <label className="block text-sm text-zinc-300">
        <div className="mb-2 flex justify-between text-xs text-zinc-500">
          <span>Deck A</span>
          <span>Deck B</span>
        </div>
        <input
          type="range"
          min={-100}
          max={100}
          value={xfade * 100}
          onChange={(e) => setXfade(Number(e.target.value) / 100)}
          className="gear-slider w-full accent-cyan-500"
        />
      </label>

      <button
        type="button"
        onClick={() => (running ? stop() : start())}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500"
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
      <p className="mt-4 text-xs text-zinc-500">
        Ready for the full booth?{" "}
        <Link href="/practice/mixer" className="text-cyan-300 hover:text-cyan-200">
          Open the 2-channel mixer
        </Link>
        .
      </p>
    </GearChassis>
  );
}
