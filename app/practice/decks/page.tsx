import { PracticeShell } from "@/components/PracticeShell";
import { Mixer } from "@/components/practice/Mixer";

export default function DecksPage() {
  return (
    <PracticeShell
      wide
      title="Decks & jog"
      description="Play/pause, tempo, sync LED, jog nudge, and a fake waveform — the same CDJ-style pair that feeds the 2-channel mixer."
    >
      <Mixer />
    </PracticeShell>
  );
}
