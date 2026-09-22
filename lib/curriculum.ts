import curriculumData from "@/content/curriculum.json";
import type { Curriculum, Lesson, Module, TrackId } from "./types";
import { UNLOCK_LESSON } from "./types";

export const curriculum = curriculumData as Curriculum;

export function getModules(): Module[] {
  return [...curriculum.modules].sort((a, b) => a.order - b.order);
}

export function getModule(moduleId: string): Module | undefined {
  return curriculum.modules.find((m) => m.id === moduleId);
}

export function getAllLessons(): Lesson[] {
  return getModules().flatMap((m) => m.lessons);
}

export function getLesson(lessonId: string): Lesson | undefined {
  for (const m of curriculum.modules) {
    const lesson = m.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getModuleForLesson(lessonId: string): Module | undefined {
  return curriculum.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function getNextLesson(lessonId: string): Lesson | undefined {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.id === lessonId);
  if (idx < 0 || idx >= all.length - 1) return undefined;
  return all[idx + 1];
}

export function getPreviousLesson(lessonId: string): Lesson | undefined {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return undefined;
  return all[idx - 1];
}

export function getLessonPosition(lessonId: string): {
  index: number;
  total: number;
  moduleTitle: string;
} | undefined {
  const mod = getModuleForLesson(lessonId);
  if (!mod) return undefined;
  const index = mod.lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) return undefined;
  return { index: index + 1, total: mod.lessons.length, moduleTitle: mod.title };
}

export function getLessonsByTrack(track: TrackId): Lesson[] {
  return getAllLessons().filter((l) => l.track === track);
}

export function getModulesByTrack(track: TrackId): Module[] {
  return getModules().filter((m) => m.track === track);
}

export function isTrackLocked(track: TrackId, completedLessons: string[]): boolean {
  if (track === "shared") return false;
  return !completedLessons.includes(UNLOCK_LESSON);
}

export function getOrderedLessonIds(): string[] {
  return getAllLessons().map((l) => l.id);
}

export function lessonCount(): number {
  return getAllLessons().length;
}

export const PRACTICE_TOOLS = [
  {
    id: "mixer",
    title: "2-channel DJ Mixer",
    description: "Club mixer + decks: gain, 3-band EQ, faders, cue, crossfader.",
    href: "/practice/mixer",
    minutes: 15,
  },
  {
    id: "metronome",
    title: "Metronome",
    description: "BPM 60–180 with accents and tap tempo.",
    href: "/practice/metronome",
    minutes: 10,
  },
  {
    id: "beat-pad",
    title: "16-step Beat Pad",
    description: "Program kick, snare, and hat patterns.",
    href: "/practice/beat-pad",
    minutes: 15,
  },
  {
    id: "eq-demo",
    title: "3-band EQ Demo",
    description: "Hear bass, mids, and highs on a loop.",
    href: "/practice/eq-demo",
    minutes: 10,
  },
  {
    id: "crossfader",
    title: "Crossfader + Bass Kill",
    description: "Feel a bass swap between two loops.",
    href: "/practice/crossfader",
    minutes: 10,
  },
  {
    id: "ear-drums",
    title: "Drum Ear Trainer",
    description: "Identify kick, snare, or hat by ear.",
    href: "/practice/ear-drums",
    minutes: 10,
  },
  {
    id: "ear-feel",
    title: "BPM Feel Trainer",
    description: "Guess slow vs medium vs fast energy.",
    href: "/practice/ear-feel",
    minutes: 10,
  },
] as const;

export function toolHref(toolId: string): string | undefined {
  return PRACTICE_TOOLS.find((t) => t.id === toolId)?.href;
}
