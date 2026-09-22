import { PracticeShell } from "@/components/PracticeShell";
import { EqDemo } from "@/components/practice/EqDemo";

export default function EqDemoPage() {
  return (
    <PracticeShell
      title="3-band EQ Demo"
      description="EQ means equalizer. Solo bass, mids, or highs on a loop so you can hear which band holds the body vs the sparkle."
    >
      <EqDemo />
    </PracticeShell>
  );
}
