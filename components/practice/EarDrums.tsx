"use client";

import { useRef, useState } from "react";
import { ensureAudio, makeHat, makeKick, makeSnare, Tone } from "@/lib/tone-helpers";
import { GearChassis } from "@/components/gear/GearChassis";

type Drum = "kick" | "snare" | "hat";
const ROUNDS = 10;
const LABELS: Record<Drum, string> = {
  kick: "Kick",
  snare: "Snare",
  hat: "Hi-hat",
};

function pick(): Drum {
  const opts: Drum[] = ["kick", "snare", "hat"];
  return opts[Math.floor(Math.random() * opts.length)];
}

export function EarDrums() {
  const [round, setRound] = useState(0); // 0 = not started; 1..ROUNDS active
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const target = useRef<Drum>("kick");
  const roundRef = useRef(0);
  const scoreRef = useRef(0);
  const instruments = useRef<{
    kick: Tone.MembraneSynth;
    snare: Tone.NoiseSynth;
    hat: Tone.MetalSynth;
  } | null>(null);

  const setup = async () => {
    await ensureAudio();
    if (!instruments.current) {
      const kick = makeKick().toDestination();
      kick.volume.value = -4;
      const snare = makeSnare().toDestination();
      snare.volume.value = -6;
      const hat = makeHat().toDestination();
      hat.volume.value = -14;
      instruments.current = { kick, snare, hat };
    }
  };

  const play = async (which: Drum) => {
    await setup();
    const t = Tone.now();
    if (which === "kick")
      instruments.current!.kick.triggerAttackRelease("C1", "8n", t);
    if (which === "snare")
      instruments.current!.snare.triggerAttackRelease("16n", t);
    if (which === "hat")
      instruments.current!.hat.triggerAttackRelease(250, "32n", t);
  };

  const presentRound = async (n: number) => {
    const d = pick();
    target.current = d;
    setLocked(false);
    setFeedback(null);
    setRound(n);
    roundRef.current = n;
    setTimeout(() => play(d), 120);
  };

  const begin = async () => {
    await setup();
    setScore(0);
    scoreRef.current = 0;
    setDone(false);
    await presentRound(1);
  };

  const guess = (g: Drum) => {
    if (locked || done || round === 0) return;
    setLocked(true);
    const correct = g === target.current;
    if (correct) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
    setFeedback(
      correct ? "Correct!" : `It was ${LABELS[target.current]}.`
    );

    const finished = roundRef.current >= ROUNDS;
    setTimeout(() => {
      if (finished) {
        setDone(true);
        return;
      }
      presentRound(roundRef.current + 1);
    }, 850);
  };

  return (
    <GearChassis plate="BeatPath EAR-D · drum identifier">
      <p className="mb-4 text-sm text-zinc-400">
        Listen, then tap which drum you heard. {ROUNDS} rounds — aim for ≥80%.
      </p>

      {round === 0 ? (
        <button
          type="button"
          onClick={begin}
          className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500"
        >
          Start {ROUNDS} rounds
        </button>
      ) : (
        <>
          <div className="mb-4 flex justify-between text-sm text-zinc-400">
            <span>
              Round {Math.min(round, ROUNDS)} / {ROUNDS}
            </span>
            <span>
              Score {score}
              {done ? ` (${Math.round((score / ROUNDS) * 100)}%)` : ""}
            </span>
          </div>

          {!done && (
            <>
              <button
                type="button"
                onClick={() => play(target.current)}
                className="mb-4 rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                Replay sound
              </button>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(LABELS) as Drum[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    disabled={locked}
                    onClick={() => guess(d)}
                    className="rounded-xl border border-zinc-600 bg-zinc-950/50 py-4 font-medium text-zinc-100 hover:border-violet-400 disabled:opacity-50"
                  >
                    {LABELS[d]}
                  </button>
                ))}
              </div>
            </>
          )}

          {feedback && (
            <p
              className={`mt-4 text-sm font-medium ${
                feedback.startsWith("Correct")
                  ? "text-emerald-400"
                  : "text-amber-300"
              }`}
            >
              {feedback}
            </p>
          )}

          {done && (
            <div className="mt-4 space-y-3">
              <p className="text-zinc-200">
                Finished: {score}/{ROUNDS} (
                {Math.round((score / ROUNDS) * 100)}%).
                {score / ROUNDS >= 0.8
                  ? " Great ears — checkpoint ready."
                  : " Replay a few rounds and listen for thump vs crack vs sizzle."}
              </p>
              <button
                type="button"
                onClick={begin}
                className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white"
              >
                Play again
              </button>
            </div>
          )}
        </>
      )}
    </GearChassis>
  );
}
