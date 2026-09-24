import { PracticeShell } from "@/components/PracticeShell";
import { SongMap } from "@/components/practice/SongMap";

export default function SongMapPage() {
  return (
    <PracticeShell
      title="Song map"
      description="A 36-bar house sketch with labeled intro, groove, break, drop, and outro. Watch sections, tap phrases, or follow the energy curve."
    >
      <SongMap />
    </PracticeShell>
  );
}
