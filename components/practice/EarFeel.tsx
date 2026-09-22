"use client";

import { useRef, useState } from "react";
import { ensureAudio, makeHat, makeKick, Tone } from "@/lib/tone-helpers";
import { GearChassis } from "@/components/gear/GearChassis";

type Bucket = "slow" | "medium" | "fast";

const BUCKETS: { id: Bucket; label: string; bpm: number; hint: string }[] = [
  { id: "slow", label: "Slow (~80–95)", bpm: 88, hint: "Hip-hop / chill" },
  { id: "medium", label: "Medium (~110–128)", bpm: 120, hint: "House / pop" },
  { id: "fast", label: "Fast (~140–174)", bpm: 160, hint: "DnB / hard dance" },
];

function pickBucket(): (typeof BUCKETS)[number] {
  return BUCKETS[Math.floor(Math.random() * BUCKETS.length)];
}

export function EarFeel() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const current = useRef<(typeof BUCKETS)[number] | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);
  const kickRef = useRef<Tone.MembraneSynth | null>(null);
  const hatRef = useRef<Tone.MetalSynth | null>(null);

  const stopAudio = () => {
    loopRef.current?.stop();
    loopRef.current?.dispose();
    loopRef.current = null;
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    setPlaying(false);
  };

  const playClip = async (bpm: number) => {
    await ensureAudio();
    stopAudio();
    if (!kickRef.current) {
      kickRef.current = makeKick().toDestination();
      kickRef.current.volume.value = -4;
    }
    if (!hatRef.current) {
      hatRef.current = makeHat().toDestination();
      hatRef.current.volume.value = -16;
    }
    Tone.getTransport().bpm.value = bpm;
    let i = 0;
    loopRef.current = new Tone.Loop((time) => {
      kickRef.current?.triggerAttackRelease("C1", "8n", time);
      if (i % 2 === 0) hatRef.current?.triggerAttackRelease(300, "32n", time + 0.01);
      i++;
    }, "4n");
    loopRef.current.start(0);
    Tone.getTransport().start();
    setPlaying(true);
    // auto-stop after ~4 seconds
    setTimeout(() => {
      stopAudio();
    }, 4000);
  };

  const next = async () => {
    setFeedback(null);
    const b = pickBucket();
    current.current = b;
    setRound((r) => r + 1);
    await playClip(b.bpm);
  };

  const begin = async () => {
    setRound(0);
    setScore(0);
    setDone(false);
    setFeedback(null);
    await next();
  };

  const guess = (id: Bucket) => {
    if (!current.current || feedback || done) return;
    stopAudio();
    const ok = id === current.current.id;
    setScore((s) => s + (ok ? 1 : 0));
    setFeedback(
      ok
        ? `Yes — ~${current.current.bpm} BPM (${current.current.hint}).`
        : `It was ${current.current.label} (~${current.current.bpm} BPM).`
    );
    if (round >= 5) {
      setDone(true);
      return;
    }
    setTimeout(() => {
      if (round >= 5) setDone(true);
      else next();
    }, 1200);
  };

  return (
    <GearChassis plate="BeatPath EAR-T · tempo feel">
      <p className="mb-4 text-sm text-zinc-400">
        Hear a short pulse and choose slow / medium / fast.{" "}
        <strong className="text-zinc-200">BPM</strong> = beats per minute —
        how fast the pulse is.
      </p>

      {round === 0 && !done ? (
        <button
          type="button"
          onClick={begin}
          className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500"
        >
          Start 5 rounds
        </button>
      ) : (
        <>
          <div className="mb-4 flex justify-between text-sm text-zinc-400">
            <span>Round {Math.min(round, 5)} / 5</span>
            <span>Score {score}</span>
          </div>
          {!done && (
            <>
              <button
                type="button"
                onClick={() =>
                  current.current && playClip(current.current.bpm)
                }
                className="mb-4 rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-200"
              >
                {playing ? "Playing…" : "Replay clip"}
              </button>
              <div className="grid gap-2 sm:grid-cols-3">
                {BUCKETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => guess(b.id)}
                    className="rounded-xl border border-zinc-600 px-3 py-4 text-sm font-medium text-zinc-100 hover:border-cyan-400 disabled:opacity-50"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {feedback && (
            <p className="mt-4 text-sm text-zinc-200">{feedback}</p>
          )}
          {done && (
            <div className="mt-4">
              <p className="text-zinc-200">
                Done — {score}/5. Keep calibrating with real tracks on Today&apos;s
                Practice.
              </p>
              <button
                type="button"
                onClick={begin}
                className="mt-3 rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white"
              >
                Again
              </button>
            </div>
          )}
        </>
      )}
    </GearChassis>
  );
}
