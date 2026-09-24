"use client";

import * as Tone from "tone";

let started = false;

export async function ensureAudio(): Promise<void> {
  if (!started) {
    await Tone.start();
    started = true;
  }
  if (Tone.getContext().state !== "running") {
    await Tone.getContext().resume();
  }
}

export function makeKick(): Tone.MembraneSynth {
  return new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 },
  });
}

export function makeSnare(): Tone.NoiseSynth {
  return new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
  });
}

export function makeHat(): Tone.MetalSynth {
  return new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  });
}

export function makeBass(): Tone.MonoSynth {
  return new Tone.MonoSynth({
    oscillator: { type: "square" },
    envelope: { attack: 0.02, decay: 0.18, sustain: 0.35, release: 0.16 },
    filter: { Q: 1, type: "lowpass", rolloff: -12 },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.12,
      sustain: 0.2,
      release: 0.2,
      baseFrequency: 60,
      octaves: 2.5,
    },
  });
}

export function makePad(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.28, decay: 0.35, sustain: 0.5, release: 0.7 },
  });
}

export { Tone };
