"use client";

import { ListenMaker } from "@/components/practice/ListenMaker";
import { SongMap } from "@/components/practice/SongMap";

export function LessonStudio({
  lessonId,
  tools,
}: {
  lessonId: string;
  tools: string[];
}) {
  return (
    <div className="mt-5 space-y-6">
      {tools.includes("listen-maker") && <ListenMaker lessonId={lessonId} />}
      {tools.includes("song-map") && (
        <SongMap
          lessonId={lessonId}
          defaultTab={lessonId === "m3.l3" ? "energy" : lessonId === "m3.l1" ? "phrases" : "watch"}
        />
      )}
    </div>
  );
}
