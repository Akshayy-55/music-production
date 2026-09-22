"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function Waveform({
  playing,
  color = "cyan",
  seed = 1,
}: {
  playing: boolean;
  color?: "cyan" | "amber";
  seed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const bars = 72;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color === "cyan" ? "#22d3ee" : "#fbbf24";
      const gap = width / bars;
      for (let i = 0; i < bars; i++) {
        const n = hash(seed * 17 + i + Math.floor(offset.current));
        const h = 6 + n * (height - 14);
        const x = i * gap;
        ctx.globalAlpha = 0.35 + n * 0.65;
        ctx.fillRect(x, (height - h) / 2, Math.max(2, gap - 2), h);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillRect(width * 0.5 - 1, 0, 2, height);
      if (playing) offset.current += 0.35;
      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, playing, seed]);

  return (
    <div
      className={cn(
        "relative h-16 overflow-hidden rounded-lg border border-zinc-700/80 bg-zinc-950 waveform-scan",
        color === "cyan" ? "shadow-[inset_0_0_24px_rgba(34,211,238,0.08)]" : "shadow-[inset_0_0_24px_rgba(251,191,36,0.08)]"
      )}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
