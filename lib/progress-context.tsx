"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProgressState, TrackId } from "./types";
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  setChecklistItem as setItem,
  setFocusTrack as setFocus,
  completeLesson as completeLessonState,
} from "./progress";

interface ProgressContextValue {
  progress: ProgressState;
  ready: boolean;
  toggleChecklist: (lessonId: string, index: number) => void;
  completeLesson: (lessonId: string) => void;
  setFocusTrack: (track: TrackId) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveProgress(progress);
  }, [progress, ready]);

  const toggleChecklist = useCallback((lessonId: string, index: number) => {
    setProgress((prev) => {
      const lessonChecks =
        prev.checklist[lessonId] ??
        Array(
          // length filled inside setChecklistItem via curriculum
          0
        );
      const current = prev.checklist[lessonId]?.[index] ?? false;
      // ensure array exists by reading through setItem
      void lessonChecks;
      return setItem(prev, lessonId, index, !current);
    });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => completeLessonState(prev, lessonId));
  }, []);

  const setFocusTrack = useCallback((track: TrackId) => {
    setProgress((prev) => setFocus(prev, track));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    setProgress(fresh);
    saveProgress(fresh);
  }, []);

  const value = useMemo(
    () => ({
      progress,
      ready,
      toggleChecklist,
      completeLesson,
      setFocusTrack,
      resetProgress,
    }),
    [progress, ready, toggleChecklist, completeLesson, setFocusTrack, resetProgress]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
