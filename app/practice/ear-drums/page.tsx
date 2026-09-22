import { PracticeShell } from "@/components/PracticeShell";
import { EarDrums } from "@/components/practice/EarDrums";

export default function EarDrumsPage() {
  return (
    <PracticeShell
      title="Drum Ear Trainer"
      description="Identify kick, snare, or hi-hat by ear. Ten scored rounds — aim for 80%+."
    >
      <EarDrums />
    </PracticeShell>
  );
}
