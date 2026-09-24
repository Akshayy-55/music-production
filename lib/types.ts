export type TrackId = "shared" | "dj" | "production";

export interface Resource {
  title: string;
  url: string;
  type: string;
}

export interface Exercise {
  title: string;
  description: string;
  durationMinutes: number;
}

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  track: TrackId;
  summary: string;
  whyItMatters: string[];
  exercise: Exercise;
  howTo?: string[];
  checklist: string[];
  resources: Resource[];
  practiceTools: string[];
  prerequisites: string[];
  successCheckpoint: string;
}

export interface Module {
  id: string;
  title: string;
  track: TrackId;
  order: number;
  estimatedHours: number;
  description: string;
  lessons: Lesson[];
}

export interface Track {
  id: TrackId;
  title: string;
  description: string;
  requiresModuleExam?: string;
}

export interface Curriculum {
  version: number;
  product: string;
  localeDefault: string;
  estimatedTotalHours: string;
  tracks: Track[];
  modules: Module[];
}

export interface ProgressState {
  version: number;
  checklist: Record<string, boolean[]>; // lessonId -> which items checked
  completedLessons: string[];
  streak: {
    count: number;
    lastActiveDate: string | null; // YYYY-MM-DD IST-ish local
  };
  focusTrack: TrackId;
  unlockedExam: boolean;
}

export const PROGRESS_VERSION = 1;
export const PROGRESS_KEY = "beatpath-progress-v1";
export const UNLOCK_LESSON = "m3.l5";
