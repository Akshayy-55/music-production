import { PracticeShell } from "@/components/PracticeShell";
import { CrossfaderTool } from "@/components/practice/Crossfader";

export default function CrossfaderPage() {
  return (
    <PracticeShell
      title="Crossfader + Bass Kill"
      description="Feel blending two decks and killing bass on one side — the core move behind clean EQ transitions."
    >
      <CrossfaderTool />
    </PracticeShell>
  );
}
