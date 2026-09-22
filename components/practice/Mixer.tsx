"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Power } from "lucide-react";
import { ensureAudio, makeHat, makeKick, makeSnare, Tone } from "@/lib/tone-helpers";
import { GearChassis } from "@/components/gear/GearChassis";
import { Knob } from "@/components/gear/Knob";
import { Fader } from "@/components/gear/Fader";
import { VuMeter } from "@/components/gear/VuMeter";
import { Waveform } from "@/components/gear/Waveform";
import { JogWheel } from "@/components/gear/JogWheel";
import { cn } from "@/lib/utils";

type ListenMode = "master" | "cue";

type ChannelNodes = {
  kick: Tone.MembraneSynth;
  hat: Tone.MetalSynth;
  extra: Tone.Synth | Tone.NoiseSynth;
  eq: Tone.EQ3;
  trim: Tone.Gain;
  fader: Tone.Gain;
  cueGain: Tone.Gain;
  xfade: Tone.Gain;
  meter: Tone.Meter;
  clock: Tone.Clock;
  step: number;
};

type Graph = {
  a: ChannelNodes;
  b: ChannelNodes;
  master: Tone.Gain;
  cueOut: Tone.Gain;
  cueBus: Tone.Gain;
  masterMeter: Tone.Meter;
};

function eqDb(v: number): number {
  if (v <= -23) return -Infinity;
  return v;
}

function xfadeGains(t: number): { a: number; b: number } {
  const x = Math.max(0, Math.min(1, t));
  return {
    a: Math.cos(x * 0.5 * Math.PI),
    b: Math.sin(x * 0.5 * Math.PI),
  };
}

function HorizontalFader({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)));
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        <span>A</span>
        <span>Crossfader</span>
        <span>B</span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Crossfader"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        tabIndex={0}
        className="relative h-10 w-full cursor-ew-resize rounded-md border border-zinc-600 bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-inner"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => {
          if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
            setFromX(e.clientX);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onChange(Math.max(0, value - 0.05));
          if (e.key === "ArrowRight") onChange(Math.min(1, value + 0.05));
        }}
      >
        <span className="absolute inset-y-2 left-1/2 w-px bg-zinc-600" />
        <span
          className="absolute top-1/2 h-8 w-10 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600 shadow-md ring-1 ring-zinc-300"
          style={{ left: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export function Mixer() {
  const [ready, setReady] = useState(false);
  const [playingA, setPlayingA] = useState(false);
  const [playingB, setPlayingB] = useState(false);
  const [bpmA, setBpmA] = useState(124);
  const [bpmB, setBpmB] = useState(124);
  const [gainA, setGainA] = useState(0);
  const [gainB, setGainB] = useState(0);
  const [hiA, setHiA] = useState(0);
  const [midA, setMidA] = useState(0);
  const [lowA, setLowA] = useState(0);
  const [hiB, setHiB] = useState(0);
  const [midB, setMidB] = useState(0);
  const [lowB, setLowB] = useState(0);
  const [faderA, setFaderA] = useState(0.85);
  const [faderB, setFaderB] = useState(0.85);
  const [xfade, setXfade] = useState(0.5);
  const [cueA, setCueA] = useState(false);
  const [cueB, setCueB] = useState(false);
  const [listen, setListen] = useState<ListenMode>("master");
  const [master, setMaster] = useState(0.7);
  const [vu, setVu] = useState({ a: 0, b: 0, m: 0 });
  const [nudgeFlash, setNudgeFlash] = useState<"a" | "b" | null>(null);

  const graph = useRef<Graph | null>(null);
  const nudgeTimer = useRef<number | null>(null);

  const applyMixer = useCallback(() => {
    const g = graph.current;
    if (!g) return;
    g.a.eq.high.value = eqDb(hiA);
    g.a.eq.mid.value = eqDb(midA);
    g.a.eq.low.value = eqDb(lowA);
    g.b.eq.high.value = eqDb(hiB);
    g.b.eq.mid.value = eqDb(midB);
    g.b.eq.low.value = eqDb(lowB);
    g.a.trim.gain.value = Tone.dbToGain(gainA);
    g.b.trim.gain.value = Tone.dbToGain(gainB);
    g.a.fader.gain.value = faderA;
    g.b.fader.gain.value = faderB;
    const xf = xfadeGains(xfade);
    g.a.xfade.gain.value = xf.a;
    g.b.xfade.gain.value = xf.b;
    g.a.cueGain.gain.value = cueA ? 1 : 0;
    g.b.cueGain.gain.value = cueB ? 1 : 0;
    g.master.gain.value = listen === "master" ? master : 0;
    g.cueOut.gain.value = listen === "cue" ? Math.max(0.35, master) : 0;
    g.a.clock.frequency.value = (bpmA / 60) * 2;
    g.b.clock.frequency.value = (bpmB / 60) * 2;
  }, [
    bpmA,
    bpmB,
    cueA,
    cueB,
    faderA,
    faderB,
    gainA,
    gainB,
    hiA,
    hiB,
    listen,
    lowA,
    lowB,
    master,
    midA,
    midB,
    xfade,
  ]);

  useEffect(() => {
    applyMixer();
  }, [applyMixer]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const g = graph.current;
      if (g) {
        const read = (m: Tone.Meter) => {
          const v = m.getValue();
          const n = typeof v === "number" ? v : v[0] ?? 0;
          return Math.max(0, Math.min(1, n));
        };
        setVu({ a: read(g.a.meter), b: read(g.b.meter), m: read(g.masterMeter) });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      if (nudgeTimer.current) window.clearTimeout(nudgeTimer.current);
      const g = graph.current;
      if (!g) return;
      g.a.clock.stop();
      g.b.clock.stop();
      const nodes: Tone.ToneAudioNode[] = [
        g.a.kick,
        g.a.hat,
        g.a.extra,
        g.a.eq,
        g.a.trim,
        g.a.fader,
        g.a.cueGain,
        g.a.xfade,
        g.a.meter,
        g.b.kick,
        g.b.hat,
        g.b.extra,
        g.b.eq,
        g.b.trim,
        g.b.fader,
        g.b.cueGain,
        g.b.xfade,
        g.b.meter,
        g.master,
        g.cueOut,
        g.cueBus,
        g.masterMeter,
      ];
      nodes.forEach((n) => n.dispose());
      g.a.clock.dispose();
      g.b.clock.dispose();
      graph.current = null;
    };
  }, []);

  const buildGraph = async () => {
    await ensureAudio();
    if (graph.current) return;

    const makeChannel = (kind: "a" | "b"): ChannelNodes => {
      const eq = new Tone.EQ3({ low: 0, mid: 0, high: 0 });
      const trim = new Tone.Gain(1);
      const fader = new Tone.Gain(0.85);
      const cueGain = new Tone.Gain(0);
      const xfade = new Tone.Gain(0.7);
      const meter = new Tone.Meter({ normalRange: true, smoothing: 0.7 });
      const kick = makeKick();
      const hat = makeHat();
      kick.volume.value = kind === "a" ? -4 : -10;
      hat.volume.value = kind === "a" ? -16 : -20;
      const extra =
        kind === "a"
          ? makeSnare()
          : new Tone.Synth({
              oscillator: { type: "triangle" },
              envelope: { attack: 0.01, decay: 0.22, sustain: 0.15, release: 0.18 },
            });
      extra.volume.value = kind === "a" ? -10 : -8;
      kick.connect(eq);
      hat.connect(eq);
      extra.connect(eq);
      eq.connect(trim);
      trim.connect(fader);
      trim.connect(cueGain);
      trim.connect(meter);
      const nodes: ChannelNodes = {
        kick,
        hat,
        extra,
        eq,
        trim,
        fader,
        cueGain,
        xfade,
        meter,
        clock: null as unknown as Tone.Clock,
        step: 0,
      };
      const clock = new Tone.Clock((time) => {
        const s = nodes.step % 8;
        nodes.step += 1;
        if (kind === "a") {
          if (s % 2 === 0) nodes.kick.triggerAttackRelease("C1", "8n", time);
          if (s % 2 === 1) nodes.hat.triggerAttackRelease(280, "32n", time);
          if (s === 2 || s === 6) {
            (nodes.extra as Tone.NoiseSynth).triggerAttackRelease("16n", time);
          }
        } else {
          const notes = ["C2", "C2", "G1", "Eb2", "C2", "F1", "G1", "Eb2"];
          (nodes.extra as Tone.Synth).triggerAttackRelease(notes[s], "8n", time);
          if (s % 2 === 1) nodes.hat.triggerAttackRelease(420, "32n", time);
          if (s === 0 || s === 4) nodes.kick.triggerAttackRelease("G1", "8n", time);
        }
      }, (124 / 60) * 2);
      nodes.clock = clock;
      return nodes;
    };

    const a = makeChannel("a");
    const b = makeChannel("b");
    const master = new Tone.Gain(0.7);
    const cueBus = new Tone.Gain(1);
    const cueOut = new Tone.Gain(0);
    const masterMeter = new Tone.Meter({ normalRange: true, smoothing: 0.7 });
    a.fader.connect(a.xfade);
    b.fader.connect(b.xfade);
    a.xfade.connect(master);
    b.xfade.connect(master);
    a.cueGain.connect(cueBus);
    b.cueGain.connect(cueBus);
    cueBus.connect(cueOut);
    master.connect(masterMeter);
    master.toDestination();
    cueOut.toDestination();
    graph.current = { a, b, master, cueOut, cueBus, masterMeter };
    applyMixer();
    setReady(true);
  };

  const toggleDeck = async (deck: "a" | "b") => {
    await buildGraph();
    const g = graph.current;
    if (!g) return;
    const ch = deck === "a" ? g.a : g.b;
    const playing = deck === "a" ? playingA : playingB;
    if (playing) {
      ch.clock.stop();
      if (deck === "a") setPlayingA(false);
      else setPlayingB(false);
    } else {
      ch.step = 0;
      ch.clock.start();
      if (deck === "a") setPlayingA(true);
      else setPlayingB(true);
    }
  };

  const stopAll = () => {
    const g = graph.current;
    if (!g) return;
    g.a.clock.stop();
    g.b.clock.stop();
    setPlayingA(false);
    setPlayingB(false);
  };

  const nudge = async (deck: "a" | "b", dir: -1 | 1) => {
    await buildGraph();
    const g = graph.current;
    if (!g) return;
    const ch = deck === "a" ? g.a : g.b;
    const bpm = deck === "a" ? bpmA : bpmB;
    const base = (bpm / 60) * 2;
    ch.clock.frequency.value = base * (dir === 1 ? 1.07 : 0.93);
    setNudgeFlash(deck);
    if (nudgeTimer.current) window.clearTimeout(nudgeTimer.current);
    nudgeTimer.current = window.setTimeout(() => {
      ch.clock.frequency.value = (deck === "a" ? bpmA : bpmB) / 60 * 2;
      setNudgeFlash(null);
    }, 140);
  };

  const synced = Math.abs(bpmA - bpmB) < 0.15;
  const live = playingA || playingB;

  const channel = (
    id: "A" | "B",
    opts: {
      gain: number;
      setGain: (n: number) => void;
      hi: number;
      setHi: (n: number) => void;
      mid: number;
      setMid: (n: number) => void;
      low: number;
      setLow: (n: number) => void;
      fader: number;
      setFader: (n: number) => void;
      cue: boolean;
      setCue: (n: boolean) => void;
      vu: number;
      accent: "cyan" | "amber";
    }
  ) => (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border bg-zinc-950/50 px-2 py-3 sm:px-3",
        opts.accent === "cyan" ? "border-cyan-500/25" : "border-amber-500/25"
      )}
    >
      <p
        className={cn(
          "text-xs font-bold tracking-[0.2em]",
          opts.accent === "cyan" ? "text-cyan-300" : "text-amber-300"
        )}
      >
        CH {id}
      </p>
      <Knob label="Gain" value={opts.gain} min={-12} max={12} onChange={opts.setGain} size={48} unit=" dB" accent={opts.accent === "cyan" ? "cyan" : "amber"} />
      <Knob label="Hi" value={opts.hi} min={-24} max={6} onChange={opts.setHi} size={48} unit=" dB" accent="rose" format={(v) => (v <= -23 ? "KILL" : `${v > 0 ? "+" : ""}${v}`)} />
      <Knob label="Mid" value={opts.mid} min={-24} max={6} onChange={opts.setMid} size={48} unit=" dB" accent="amber" format={(v) => (v <= -23 ? "KILL" : `${v > 0 ? "+" : ""}${v}`)} />
      <Knob label="Low" value={opts.low} min={-24} max={6} onChange={opts.setLow} size={48} unit=" dB" accent="violet" format={(v) => (v <= -23 ? "KILL" : `${v > 0 ? "+" : ""}${v}`)} />
      <button
        type="button"
        onClick={() => opts.setCue(!opts.cue)}
        className={cn(
          "w-full rounded-md border px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]",
          opts.cue
            ? "border-orange-400 bg-orange-500 text-zinc-950 shadow-[0_0_12px_rgba(249,115,22,0.55)]"
            : "border-zinc-600 bg-zinc-900 text-zinc-400"
        )}
      >
        Cue
      </button>
      <div className="flex items-end gap-2">
        <Fader value={opts.fader} onChange={opts.setFader} label="Level" height={132} accent={opts.accent === "cyan" ? "cyan" : "violet"} />
        <VuMeter level={opts.vu} />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-400">
        Two looping decks into a club-style mixer. Drag knobs (up/down), ride
        faders, then sweep the crossfader. Cue buttons are PFL — preview in the
        headphone bus; the room still hears Master.
      </p>

      <GearChassis plate="BeatPath CDJ pair — kick loop / bass loop">
        <div className="grid gap-5 lg:grid-cols-2">
          {(
            [
              {
                id: "A" as const,
                playing: playingA,
                bpm: bpmA,
                setBpm: setBpmA,
                color: "cyan" as const,
                loop: "Kick loop",
                seed: 3,
              },
              {
                id: "B" as const,
                playing: playingB,
                bpm: bpmB,
                setBpm: setBpmB,
                color: "amber" as const,
                loop: "Bass loop",
                seed: 9,
              },
            ]
          ).map((deck) => (
            <div
              key={deck.id}
              className={cn(
                "rounded-xl border bg-zinc-950/40 p-4",
                deck.color === "cyan" ? "border-cyan-500/20" : "border-amber-500/20"
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  Deck {deck.id} · {deck.loop}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    synced
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {synced ? "Sync" : "Offset"}
                </span>
              </div>
              <Waveform playing={deck.playing} color={deck.color} seed={deck.seed} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <JogWheel
                  playing={deck.playing}
                  color={deck.color}
                  label={`Jog ${deck.id}`}
                  onNudge={(dir) => nudge(deck.id === "A" ? "a" : "b", dir)}
                />
                <div className="min-w-[180px] flex-1 space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-3xl font-bold tabular-nums text-white">
                      {deck.bpm.toFixed(1)}
                      <span className="ml-1 text-xs font-medium text-zinc-500">BPM</span>
                    </p>
                    {nudgeFlash === (deck.id === "A" ? "a" : "b") && (
                      <span className="text-[10px] uppercase tracking-wide text-violet-300">
                        Nudge
                      </span>
                    )}
                  </div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    Tempo
                    <input
                      type="range"
                      min={110}
                      max={140}
                      step={0.1}
                      value={deck.bpm}
                      onChange={(e) => deck.setBpm(Number(e.target.value))}
                      className="gear-slider mt-1 w-full accent-violet-500"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDeck(deck.id === "A" ? "a" : "b")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500"
                    >
                      {deck.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {deck.playing ? "Pause" : "Play"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (deck.id === "B") setBpmB(bpmA);
                        else setBpmA(bpmB);
                      }}
                      className="rounded-lg border border-zinc-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-emerald-400/60"
                    >
                      Match tempo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GearChassis>

      <GearChassis plate="BeatPath DJM-2 · 2-channel club mixer">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Power className={cn("h-4 w-4", ready ? "text-emerald-400" : "text-zinc-600")} />
            {ready ? "Audio engaged" : "Tap Play on a deck to unlock audio"}
          </div>
          <div className="flex rounded-lg border border-zinc-700 p-0.5">
            <button
              type="button"
              onClick={() => setListen("master")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold",
                listen === "master" ? "bg-zinc-100 text-zinc-950" : "text-zinc-400"
              )}
            >
              Master
            </button>
            <button
              type="button"
              onClick={() => setListen("cue")}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold",
                listen === "cue" ? "bg-orange-500 text-zinc-950" : "text-zinc-400"
              )}
            >
              <Headphones className="h-3.5 w-3.5" /> Cue mix
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:gap-4">
          {channel("A", {
            gain: gainA,
            setGain: setGainA,
            hi: hiA,
            setHi: setHiA,
            mid: midA,
            setMid: setMidA,
            low: lowA,
            setLow: setLowA,
            fader: faderA,
            setFader: setFaderA,
            cue: cueA,
            setCue: setCueA,
            vu: vu.a,
            accent: "cyan",
          })}
          {channel("B", {
            gain: gainB,
            setGain: setGainB,
            hi: hiB,
            setHi: setHiB,
            mid: midB,
            setMid: setMidB,
            low: lowB,
            setLow: setLowB,
            fader: faderB,
            setFader: setFaderB,
            cue: cueB,
            setCue: setCueB,
            vu: vu.b,
            accent: "amber",
          })}
          <div className="col-span-2 flex items-end justify-center gap-6 rounded-xl border border-zinc-700/80 bg-zinc-950/50 p-4 sm:col-span-1 sm:flex-col sm:justify-start">
            <Knob
              label="Master"
              value={Math.round(master * 100)}
              min={0}
              max={100}
              onChange={(v) => setMaster(v / 100)}
              size={64}
              unit="%"
              accent="cyan"
              format={(v) => `${v}%`}
            />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Master
              </span>
              <VuMeter level={vu.m} />
            </div>
            <button
              type="button"
              onClick={stopAll}
              disabled={!live}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
            >
              Stop decks
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-700/70 bg-zinc-950/40 p-4">
          <HorizontalFader value={xfade} onChange={setXfade} />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          Routing: each deck hits Gain → 3-band EQ (full left = kill) → channel
          fader → crossfader → Master. Headphone Cue is pre-fader listen
          (PFL): turn Cue on a channel, then flip <strong className="text-zinc-300">Cue mix</strong> to
          hear it without changing what Master would send to the room. Loops are
          synthesized in the browser — no sample packs.
        </p>
      </GearChassis>
    </div>
  );
}
