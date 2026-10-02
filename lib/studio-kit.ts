"use client";

import {
  makeBass,
  makeHat,
  makeKick,
  makePad,
  makeSnare,
  Tone,
} from "@/lib/tone-helpers";

export type StudioKit = {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  hat: Tone.MetalSynth;
  bass: Tone.MonoSynth;
  pad: Tone.Synth;
  dispose: () => void;
};

export function createStudioKit(): StudioKit {
  const kick = makeKick().toDestination();
  kick.volume.value = -6;
  const snare = makeSnare().toDestination();
  snare.volume.value = -10;
  const hat = makeHat().toDestination();
  hat.volume.value = -20;
  const bass = makeBass().toDestination();
  bass.volume.value = -9;
  const pad = makePad().toDestination();
  pad.volume.value = -16;

  return {
    kick,
    snare,
    hat,
    bass,
    pad,
    dispose() {
      kick.dispose();
      snare.dispose();
      hat.dispose();
      bass.dispose();
      pad.dispose();
    },
  };
}

export function stopTransport() {
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  Tone.getTransport().position = 0;
}

export function secondsPerBar(bpm: number): number {
  return (4 * 60) / bpm;
}

export function at(bar: number, beat = 0, sixteenth = 0): string {
  return `${bar}:${beat}:${sixteenth}`;
}
