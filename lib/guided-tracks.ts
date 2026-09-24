import { at, type StudioKit } from "@/lib/studio-kit";

export type Feel = "slow" | "medium" | "fast";

export type CoachStep = {
  atBar: number;
  title: string;
  body: string;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Section = {
  id: string;
  label: string;
  startBar: number;
  bars: number;
  energy: number;
  color: string;
};

export type ListenSample = {
  id: string;
  title: string;
  vibe: string;
  bpm: number;
  feel: Feel;
  bars: number;
  drumsStayConstant: boolean;
  firstChange: string;
  firstChangeBar: number;
  sections: Section[];
  coach: CoachStep[];
  questions: QuizQuestion[];
  schedule: (kit: StudioKit) => void;
};

function hats(
  kit: StudioKit,
  bar: number,
  every: "8n" | "16n" = "8n"
) {
  const steps = every === "16n" ? 16 : 8;
  for (let i = 0; i < steps; i++) {
    const beat = Math.floor(i / (steps / 4));
    const six = (i % (steps / 4)) * (16 / steps);
    kit.hat.triggerAttackRelease(240, "32n", at(bar, beat, six));
  }
}

function fourOnFloor(kit: StudioKit, bar: number) {
  for (let beat = 0; beat < 4; beat++) {
    kit.kick.triggerAttackRelease("C1", "8n", at(bar, beat, 0));
  }
}

function boomBap(kit: StudioKit, bar: number) {
  kit.kick.triggerAttackRelease("C1", "8n", at(bar, 0, 0));
  kit.kick.triggerAttackRelease("C1", "8n", at(bar, 2, 0));
  kit.snare.triggerAttackRelease("16n", at(bar, 1, 0));
  kit.snare.triggerAttackRelease("16n", at(bar, 3, 0));
}

function scheduleNightBus(kit: StudioKit) {
  for (let bar = 0; bar < 8; bar++) {
    boomBap(kit, bar);
    hats(kit, bar, "8n");
    if (bar < 4 || bar >= 6) {
      kit.bass.triggerAttackRelease("C1", "2n", at(bar, 0, 0));
      kit.bass.triggerAttackRelease("G0", "4n", at(bar, 2, 0));
    }
  }
}

function scheduleWarehouse(kit: StudioKit) {
  for (let bar = 0; bar < 8; bar++) {
    hats(kit, bar, "8n");
    if (bar >= 4) {
      fourOnFloor(kit, bar);
      kit.bass.triggerAttackRelease("C1", "4n", at(bar, 0, 0));
      kit.bass.triggerAttackRelease("C1", "4n", at(bar, 2, 0));
    }
  }
}

function scheduleRooftop(kit: StudioKit) {
  for (let bar = 0; bar < 8; bar++) {
    const breakdown = bar >= 3 && bar <= 4;
    if (!breakdown) {
      fourOnFloor(kit, bar);
      hats(kit, bar, "16n");
      kit.bass.triggerAttackRelease("G1", "8n", at(bar, 0, 0));
    }
    kit.pad.triggerAttackRelease(breakdown ? "G3" : "D3", "1m", at(bar, 0, 0));
  }
}

function scheduleClubMap(kit: StudioKit) {
  // 36 bars: intro 8, groove 8, break 8, drop 8, outro 4
  for (let bar = 0; bar < 36; bar++) {
    const intro = bar < 8;
    const groove = bar >= 8 && bar < 16;
    const brk = bar >= 16 && bar < 24;
    const drop = bar >= 24 && bar < 32;
    const outro = bar >= 32;

    if (intro) {
      hats(kit, bar, "8n");
      if (bar >= 4) kit.kick.triggerAttackRelease("C1", "8n", at(bar, 0, 0));
    } else if (groove) {
      fourOnFloor(kit, bar);
      hats(kit, bar, "8n");
      kit.snare.triggerAttackRelease("16n", at(bar, 1, 0));
      kit.snare.triggerAttackRelease("16n", at(bar, 3, 0));
      kit.bass.triggerAttackRelease("C1", "4n", at(bar, 0, 0));
      kit.bass.triggerAttackRelease("Eb1", "4n", at(bar, 2, 0));
    } else if (brk) {
      kit.pad.triggerAttackRelease("G3", "1m", at(bar, 0, 0));
      if (bar >= 20) hats(kit, bar, "16n");
    } else if (drop) {
      fourOnFloor(kit, bar);
      hats(kit, bar, "16n");
      kit.snare.triggerAttackRelease("16n", at(bar, 1, 0));
      kit.snare.triggerAttackRelease("16n", at(bar, 3, 0));
      kit.bass.triggerAttackRelease("C1", "8n", at(bar, 0, 0));
      kit.bass.triggerAttackRelease("C1", "8n", at(bar, 2, 0));
      kit.pad.triggerAttackRelease("C3", "2n", at(bar, 0, 0));
    } else if (outro) {
      hats(kit, bar, "8n");
      if (bar < 35) kit.kick.triggerAttackRelease("C1", "8n", at(bar, 0, 0));
    }
  }
}

export const LISTEN_SAMPLES: ListenSample[] = [
  {
    id: "night-bus",
    title: "Night Bus",
    vibe: "Late-night hip-hop pulse — drums never leave",
    bpm: 88,
    feel: "slow",
    bars: 8,
    drumsStayConstant: true,
    firstChange: "Bass drops out at bar 5, then returns at bar 7",
    firstChangeBar: 4,
    sections: [
      { id: "full", label: "Drums + bass", startBar: 0, bars: 4, energy: 0.7, color: "bg-violet-500" },
      { id: "drop-out", label: "Bass out", startBar: 4, bars: 2, energy: 0.35, color: "bg-amber-400" },
      { id: "return", label: "Bass back", startBar: 6, bars: 2, energy: 0.7, color: "bg-cyan-400" },
    ],
    coach: [
      {
        atBar: 0,
        title: "Feel the speed first",
        body: "This sits in your chest, not your feet. Slow = hip-hop / chill. Count 1-2-3-4 with the snare on 2 and 4.",
      },
      {
        atBar: 4,
        title: "Energy change — bass left",
        body: "Drums are still there. The bassline disappeared. That is still a change DJs and producers mark.",
      },
      {
        atBar: 6,
        title: "Bass returns",
        body: "Same drum pattern the whole way. Only the bass moved. Write: drums constant = yes.",
      },
    ],
    questions: [
      {
        q: "What is the speed feel?",
        options: ["Slow", "Medium", "Fast"],
        answer: 0,
        why: "88 BPM — hip-hop / night-bus tempo. Your body should want to nod, not run.",
      },
      {
        q: "Where is the first big energy change?",
        options: [
          "Kick enters after a hat-only intro",
          "Bass drops out, then comes back",
          "Drums vanish for a breakdown",
        ],
        answer: 1,
        why: "Bars 5–6 go drums-only. The beat stays; the low end leaves. That is the move.",
      },
      {
        q: "Do the drums stay constant?",
        options: ["Yes — kick/snare/hats keep going", "No — drums leave and return"],
        answer: 0,
        why: "The kit never stops. Only the bass takes a two-bar holiday.",
      },
    ],
    schedule: scheduleNightBus,
  },
  {
    id: "warehouse",
    title: "Warehouse Pulse",
    vibe: "House intro → four-on-the-floor lift",
    bpm: 122,
    feel: "medium",
    bars: 8,
    drumsStayConstant: false,
    firstChange: "Kick and bass enter at bar 5 after hats-only intro",
    firstChangeBar: 4,
    sections: [
      { id: "intro", label: "Hats only", startBar: 0, bars: 4, energy: 0.25, color: "bg-zinc-500" },
      { id: "lift", label: "Kick + bass in", startBar: 4, bars: 4, energy: 0.85, color: "bg-violet-500" },
    ],
    coach: [
      {
        atBar: 0,
        title: "Hats only — this is an intro",
        body: "DJs love this runway. Medium house tempo (~122). No kick yet. Wait for the floor to arrive.",
      },
      {
        atBar: 4,
        title: "Kick and bass enter",
        body: "Four-on-the-floor: kick on every beat. This is the first energy change — the track 'starts' for the room.",
      },
    ],
    questions: [
      {
        q: "What is the speed feel?",
        options: ["Slow", "Medium", "Fast"],
        answer: 1,
        why: "122 BPM is classic house / pop-dance. Medium = you can walk or bounce.",
      },
      {
        q: "Where is the first big energy change?",
        options: [
          "Kick and bass enter after the hats",
          "Bass drops out while drums stay",
          "Everything stops for a pad",
        ],
        answer: 0,
        why: "Bars 1–4 are a mix-in intro. Bar 5 is the lift — kick + bass.",
      },
      {
        q: "Do the drums stay constant from the start?",
        options: ["Yes — full kit the whole time", "No — the kick arrives later"],
        answer: 1,
        why: "Hats start alone. Kick arriving later means drums are not constant.",
      },
    ],
    schedule: scheduleWarehouse,
  },
  {
    id: "rooftop",
    title: "Rooftop Drop",
    vibe: "Fast energy, breakdown, then the slam",
    bpm: 148,
    feel: "fast",
    bars: 8,
    drumsStayConstant: false,
    firstChange: "Drums leave for a 2-bar breakdown, then slam back",
    firstChangeBar: 3,
    sections: [
      { id: "run", label: "Full run", startBar: 0, bars: 3, energy: 0.8, color: "bg-rose-400" },
      { id: "break", label: "Breakdown", startBar: 3, bars: 2, energy: 0.2, color: "bg-amber-300" },
      { id: "drop", label: "Drop", startBar: 5, bars: 3, energy: 1, color: "bg-cyan-400" },
    ],
    coach: [
      {
        atBar: 0,
        title: "This one is fast",
        body: "148 BPM — running, not walking. Kick on every beat plus busy hats. Hold on for the hole.",
      },
      {
        atBar: 3,
        title: "Breakdown — drums gone",
        body: "Only the pad is left. Producers call this space a break. DJs often mix or raise a filter here.",
      },
      {
        atBar: 5,
        title: "Drop — drums slam back",
        body: "Energy peak. First change was the hole, not the drop. Drums did not stay constant.",
      },
    ],
    questions: [
      {
        q: "What is the speed feel?",
        options: ["Slow", "Medium", "Fast"],
        answer: 2,
        why: "148 BPM is in the fast lane (hard dance / drum-adjacent energy).",
      },
      {
        q: "Where is the first big energy change?",
        options: [
          "A bassline fades in under steady drums",
          "Drums cut out, then slam back",
          "The track stays flat the whole way",
        ],
        answer: 1,
        why: "The hole is the first change. The drop is the second — the answer to that hole.",
      },
      {
        q: "Do the drums stay constant?",
        options: ["Yes", "No"],
        answer: 1,
        why: "Two bars have no kick or hats. That is a breakdown.",
      },
    ],
    schedule: scheduleRooftop,
  },
];

export const CLUB_MAP = {
  id: "club-map",
  title: "Club Map (demo arrangement)",
  vibe: "A tiny dance track with a real energy shape",
  bpm: 122,
  bars: 36,
  sections: [
    { id: "intro", label: "Intro", startBar: 0, bars: 8, energy: 0.25, color: "bg-zinc-500" },
    { id: "groove", label: "Groove", startBar: 8, bars: 8, energy: 0.7, color: "bg-violet-500" },
    { id: "break", label: "Break", startBar: 16, bars: 8, energy: 0.2, color: "bg-amber-400" },
    { id: "drop", label: "Drop", startBar: 24, bars: 8, energy: 1, color: "bg-cyan-400" },
    { id: "outro", label: "Outro", startBar: 32, bars: 4, energy: 0.3, color: "bg-zinc-400" },
  ] satisfies Section[],
  coach: [
    {
      atBar: 0,
      title: "Intro — mix-in runway",
      body: "Hats, then a lonely kick. DJs start the next track here because it is not too busy.",
    },
    {
      atBar: 8,
      title: "Groove — the main idea",
      body: "Four-on-the-floor + bass. This is the 'song' people dance to. New 8-bar phrase.",
    },
    {
      atBar: 16,
      title: "Break — energy drops",
      body: "Drums leave. A pad holds the key. Builds often live here. Another phrase boundary.",
    },
    {
      atBar: 24,
      title: "Drop — peak energy",
      body: "Full kit and bass slam back. This is the moment a set or track is remembered for.",
    },
    {
      atBar: 32,
      title: "Outro — mix-out runway",
      body: "Elements peel off so you can leave cleanly. Shorter on purpose (4 bars in this demo).",
    },
  ] satisfies CoachStep[],
  questions: [
    {
      q: "Which section is the best DJ mix-in runway?",
      options: ["Drop", "Intro", "Break"],
      answer: 1,
      why: "Intros are sparse on purpose so two tracks can overlap without a trainwreck.",
    },
    {
      q: "When do the drums leave?",
      options: ["Groove", "Break", "Outro"],
      answer: 1,
      why: "The break is the hole. Energy falls so the drop has somewhere to jump from.",
    },
    {
      q: "How long is each main phrase here?",
      options: ["4 bars", "8 bars", "32 bars"],
      answer: 1,
      why: "Intro, groove, break, and drop are each 8 bars. Dance music loves 8 / 16 / 32.",
    },
  ] satisfies QuizQuestion[],
  schedule: scheduleClubMap,
};

export function sectionAt(sections: Section[], bar: number): Section | undefined {
  return [...sections].reverse().find((s) => bar >= s.startBar);
}

export function coachAt(steps: CoachStep[], bar: number): CoachStep | undefined {
  return [...steps].reverse().find((s) => bar >= s.atBar);
}
