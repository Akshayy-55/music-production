import { PracticeShell } from "@/components/PracticeShell";
import { EarFeel } from "@/components/practice/EarFeel";

export default function EarFeelPage() {
  return (
    <PracticeShell
      title="BPM Feel Trainer"
      description="Guess whether a pulse feels slow, medium, or fast — rough BPM training without a readout."
    >
      <EarFeel />
    </PracticeShell>
  );
}
