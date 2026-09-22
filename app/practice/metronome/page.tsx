import { PracticeShell } from "@/components/PracticeShell";
import { Metronome } from "@/components/practice/Metronome";

export default function MetronomePage() {
  return (
    <PracticeShell
      title="Metronome"
      description="Set BPM (beats per minute), hear accents every 4 beats, and train your pulse. Tap tempo if you are matching a song."
    >
      <Metronome />
    </PracticeShell>
  );
}
