import { PracticeShell } from "@/components/PracticeShell";
import { Mixer } from "@/components/practice/Mixer";

export default function MixerPage() {
  return (
    <PracticeShell
      wide
      title="2-channel DJ mixer"
      description="A club-style DJM strip plus two looping decks. Gain, 3-band EQ, channel faders, headphone cue, master, and a crossfader — all audible after you tap Play."
    >
      <Mixer />
    </PracticeShell>
  );
}
