import { PracticeShell } from "@/components/PracticeShell";
import { BeatPad } from "@/components/practice/BeatPad";

export default function BeatPadPage() {
  return (
    <PracticeShell
      title="16-step Beat Pad"
      description="Program kick, snare, and hi-hat on a 16-step grid. Start with four-on-the-floor, then add swing."
    >
      <BeatPad />
    </PracticeShell>
  );
}
