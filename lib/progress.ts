"use client";

import {
  PROGRESS_KEY,
  PROGRESS_VERSION,
  UNLOCK_LESSON,
  type ProgressState,
  type TrackId,
} from "./types";
import { getAllLessons, getLesson, getModules } from "./curriculum";

export function defaultProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    checklist: {},
    completedLessons: [],
    streak: { count: 0, lastActiveDate: null },
    focusTrack: "shared",
    unlockedExam: false,
  };
}

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed.version !== PROGRESS_VERSION) return defaultProgress();
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function bumpStreak(state: ProgressState): ProgressState {
  const today = todayLocal();
  const { lastActiveDate, count } = state.streak;
  if (lastActiveDate === today) return state;
  let next = 1;
  if (lastActiveDate === yesterdayLocal()) next = count + 1;
  return {
    ...state,
    streak: { count: next, lastActiveDate: today },
  };
}

export function isLessonComplete(
  state: ProgressState,
  lessonId: string
): boolean {
  if (state.completedLessons.includes(lessonId)) return true;
  const lesson = getLesson(lessonId);
  if (!lesson) return false;
  const checks = state.checklist[lessonId];
  if (!checks || checks.length !== lesson.checklist.length) return false;
  return checks.every(Boolean);
}

export function setChecklistItem(
  state: ProgressState,
  lessonId: string,
  index: number,
  checked: boolean
): ProgressState {
  const lesson = getLesson(lessonId);
  if (!lesson) return state;
  const prev = state.checklist[lessonId] ?? lesson.checklist.map(() => false);
  const nextChecks = [...prev];
  while (nextChecks.length < lesson.checklist.length) nextChecks.push(false);
  nextChecks[index] = checked;

  let next: ProgressState = {
    ...state,
    checklist: { ...state.checklist, [lessonId]: nextChecks },
  };

  const allDone = nextChecks.every(Boolean);
  const already = next.completedLessons.includes(lessonId);
  if (allDone && !already) {
    const completedLessons = [...next.completedLessons, lessonId];
    next = bumpStreak({
      ...next,
      completedLessons,
      unlockedExam: completedLessons.includes(UNLOCK_LESSON),
    });
  } else if (!allDone && already) {
    const completedLessons = next.completedLessons.filter(
      (id) => id !== lessonId
    );
    next = {
      ...next,
      completedLessons,
      unlockedExam: completedLessons.includes(UNLOCK_LESSON),
    };
  }

  return next;
}

export function overallProgress(state: ProgressState): number {
  const total = getAllLessons().length;
  if (total === 0) return 0;
  const done = getAllLessons().filter((l) => isLessonComplete(state, l.id))
    .length;
  return Math.round((done / total) * 100);
}

export function moduleProgress(
  state: ProgressState,
  moduleId: string
): { done: number; total: number; percent: number } {
  const mod = getModules().find((m) => m.id === moduleId);
  if (!mod) return { done: 0, total: 0, percent: 0 };
  const total = mod.lessons.length;
  const done = mod.lessons.filter((l) => isLessonComplete(state, l.id)).length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function trackProgress(
  state: ProgressState,
  track: TrackId
): { done: number; total: number; percent: number } {
  const lessons = getAllLessons().filter((l) => l.track === track);
  const total = lessons.length;
  const done = lessons.filter((l) => isLessonComplete(state, l.id)).length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function completeLesson(
  state: ProgressState,
  lessonId: string
): ProgressState {
  const lesson = getLesson(lessonId);
  if (!lesson) return state;
  const nextChecks = lesson.checklist.map(() => true);
  let next: ProgressState = {
    ...state,
    checklist: { ...state.checklist, [lessonId]: nextChecks },
  };
  if (!next.completedLessons.includes(lessonId)) {
    const completedLessons = [...next.completedLessons, lessonId];
    next = bumpStreak({
      ...next,
      completedLessons,
      unlockedExam: completedLessons.includes(UNLOCK_LESSON),
    });
  } else {
    next = {
      ...next,
      unlockedExam: next.completedLessons.includes(UNLOCK_LESSON),
    };
  }
  return next;
}

export function getNextIncompleteLesson(
  state: ProgressState
): string | undefined {
  const all = getAllLessons();
  const unlocked = state.completedLessons.includes(UNLOCK_LESSON);
  const focus = !unlocked ? "shared" : state.focusTrack;

  for (const l of all) {
    if (isLessonComplete(state, l.id)) continue;
    if (l.track === "dj" || l.track === "production") {
      if (!unlocked) continue;
      if (focus === "dj" && l.track !== "dj") continue;
      if (focus === "production" && l.track !== "production") continue;
      // focus === "shared" → allow any unlocked track in order
    }
    return l.id;
  }

  // Fallback: any incomplete (e.g. other track after finishing focus)
  for (const l of all) {
    if (!isLessonComplete(state, l.id)) {
      if (
        (l.track === "dj" || l.track === "production") &&
        !unlocked
      ) {
        continue;
      }
      return l.id;
    }
  }
  return undefined;
}

export function setFocusTrack(
  state: ProgressState,
  track: TrackId
): ProgressState {
  return { ...state, focusTrack: track };
}

export type DrillId =
  | "metronome"
  | "ear-drums"
  | "beat-pad"
  | "eq-demo"
  | "crossfader"
  | "ear-feel"
  | "mixer"
  | "listen-maker"
  | "song-map";

const DRILL_ROTATION: DrillId[] = [
  "metronome",
  "listen-maker",
  "ear-drums",
  "beat-pad",
  "eq-demo",
  "crossfader",
  "song-map",
  "ear-feel",
  "mixer",
];

export function pickDrill(state: ProgressState): DrillId {
  const n = state.completedLessons.length;
  return DRILL_ROTATION[n % DRILL_ROTATION.length];
}
