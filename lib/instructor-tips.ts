import type { Lesson } from "@/lib/types";

const TIPS: Record<string, string> = {
  "m0.l1": "Treat BeatPath like a course, not a tab you binge. Same time each day beats a heroic weekend.",
  "m0.l2": "Don't hunt songs yet. Play our three studio clips. The coach names the change — your job is to hear it, then answer.",
  "m1.l1": "Speed is a body feeling before it is a number. Slow sits in the chest; medium walks; fast wants to run.",
  "m3.l1": "Phrases are felt, not guessed. Tap New phrase when the pattern restarts — then compare to the 8-bar grid.",
  "m3.l2": "Names vary. Watch the energy shape: sparse → full → empty → slam → fade. That's intro, groove, break, drop, outro.",
  "m3.l3": "The drop is the peak only because the break made a hole. Flat energy is why loops get boring.",
  "m3.l5": "This exam is a confidence gate. If an item feels shaky, retake that lesson — DJ and Production both need it.",
  "m4.l2": "Cue is not Play. Set a cue, preview in headphones, then bring the track into the room with the fader.",
  "m4.l4": "Master is the dancefloor. Cue mix is your private preview. Practice flipping between them on the DJM-2 mixer.",
  "m4.l6": "Sync is a training wheel. Use it to learn phrasing — then steal a minute without it so you still hear tempo.",
  "m5.l1": "Match tempo before you touch the crossfader. Two tracks at different BPMs will never blend cleanly.",
  "m5.l2": "Nudge is a tap, not a shove. Tiny jog moves keep kicks glued; panic scratches create trainwrecks.",
  "m5.l5": "One bassline at a time. Kill LOW on the incoming channel, then swap as you crossfade — same knobs as the mixer tool.",
  "m5.l7": "Short transition gyms build booth memory. Five honest sessions beat one long messy night.",
};

export function getInstructorTip(lesson: Lesson): string | undefined {
  if (TIPS[lesson.id]) return TIPS[lesson.id];
  if (lesson.track === "dj") {
    return "Map every control you read about onto the BeatPath mixer: gain, HI/MID/LOW, channel fader, cue, crossfader. Then find the same strip in Mixxx.";
  }
  return undefined;
}
