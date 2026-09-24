"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { ensureAudio, makeHat, makeKick, Tone } from "@/lib/tone-helpers";
import { GearChassis } from "@/components/gear/GearChassis";
import { Knob } from "@/components/gear/Knob";

export function EqDemo() {
  const [running, setRunning] = useState(false);
  const [low, setLow] = useState(0);
  const [mid, setMid] = useState(0);
  const [high, setHigh] = useState(0);
  const [solo, setSolo] = useState<"all" | "low" | "mid" | "high">("all");
  const nodes = useRef<{
    kick: Tone.MembraneSynth;
    synth: Tone.Synth;
    hat: Tone.MetalSynth;
    lowGain: Tone.Gain;
    midGain: Tone.Gain;
    highGain: Tone.Gain;
    loop?: Tone.Loop;
  } | null>(null);

  useEffect(() => {
    return () => {
      nodes.current?.loop?.stop();
      nodes.current?.loop?.dispose();
      nodes.current?.kick.dispose();
      nodes.current?.synth.dispose();
      nodes.current?.hat.dispose();
      nodes.current?.lowGain.dispose();
      nodes.current?.midGain.dispose();
      nodes.current?.highGain.dispose();
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
    };
  }, []);

  const applyGains = useCallback(() => {
    if (!nodes.current) return;
    const db = (v: number) => v;
    const mute = -60;
    if (solo === "all") {
      nodes.current.lowGain.gain.value = Tone.dbToGain(db(low));
      nodes.current.midGain.gain.value = Tone.dbToGain(db(mid));
      nodes.current.highGain.gain.value = Tone.dbToGain(db(high));
    } else {
      nodes.current.lowGain.gain.value = Tone.dbToGain(solo === "low" ? db(low) : mute);
      nodes.current.midGain.gain.value = Tone.dbToGain(solo === "mid" ? db(mid) : mute);
      nodes.current.highGain.gain.value = Tone.dbToGain(solo === "high" ? db(high) : mute);
    }
  }, [low, mid, high, solo]);

  useEffect(() => {
    applyGains();
  }, [applyGains]);

  const stop = () => {
    nodes.current?.loop?.stop();
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    setRunning(false);
  };

  const start = async () => {
    await ensureAudio();
    if (!nodes.current) {
      const lowG = new Tone.Gain(1).toDestination();
      const midG = new Tone.Gain(1).toDestination();
      const highG = new Tone.Gain(1).toDestination();

      const kick = makeKick();
      kick.connect(lowG);
      kick.volume.value = -6;

      const synth = new Tone.Synth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.2 },
      });
      synth.connect(midG);
      synth.volume.value = -10;

      const hat = makeHat();
      hat.connect(highG);
      hat.volume.value = -18;

      const notes = ["C3", "E3", "G3", "A3", "G3", "E3", "C3", "G2"];
      let ni = 0;
      const loop = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time);
        synth.triggerAttackRelease(notes[ni % notes.length], "8n", time);
        hat.triggerAttackRelease(280, "32n", time + 0.12);
        ni++;
      }, "4n");

      nodes.current = { kick, synth, hat, lowGain: lowG, midGain: midG, highGain: highG, loop };
    }
    applyGains();
    Tone.getTransport().bpm.value = 100;
    nodes.current.loop?.start(0);
    Tone.getTransport().start();
    setRunning(true);
  };

  return (
    <GearChassis plate="BeatPath EQ-3 · isolator">
      <p className="mb-5 text-sm text-zinc-400">
        Kick lives in Low, the melody in Mid, hats in High. Solo a band — that
        is what a club isolator does.{" "}
        <strong className="text-zinc-200">EQ</strong> means equalizer — boost or
        cut frequency ranges. Same knobs as HI / MID / LOW on the mixer.
      </p>
      <div className="mb-6 flex flex-wrap justify-center gap-6">
        <Knob label="Low" value={low} min={-24} max={12} onChange={setLow} unit=" dB" accent="violet" />
        <Knob label="Mid" value={mid} min={-24} max={12} onChange={setMid} unit=" dB" accent="amber" />
        <Knob label="High" value={high} min={-24} max={12} onChange={setHigh} unit=" dB" accent="rose" />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "low", "mid", "high"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSolo(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              solo === s
                ? "bg-cyan-500 text-zinc-950"
                : "border border-zinc-600 text-zinc-400"
            }`}
          >
            Solo {s}
          </button>
        ))}
      </div>

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
            <Play className="h-4 w-4" /> Play loop
          </>
        )}
      </button>
      <p className="mt-4 text-xs text-zinc-500">
        Same three bands live on each strip of the{" "}
        <Link href="/practice/mixer" className="text-cyan-300 hover:text-cyan-200">
          2-channel mixer
        </Link>
        .
      </p>
    </GearChassis>
  );
}
