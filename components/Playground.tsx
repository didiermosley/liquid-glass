"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { GlassElement } from "@/components/GlassElement";

const DEFAULTS = { strength: 100, depth: 10, blur: 2, chromaticAberration: 0, radius: 60, tint: 0.15, debug: false };
type Settings = typeof DEFAULTS;

const SLIDERS: { key: Exclude<keyof Settings, "debug">; label: string; min: number; max: number; step: number }[] = [
  { key: "strength", label: "Strength", min: 0, max: 300, step: 5 },
  { key: "depth", label: "Depth", min: 1, max: 40, step: 1 },
  { key: "blur", label: "Blur", min: 0, max: 10, step: 0.5 },
  { key: "chromaticAberration", label: "Chromatic", min: 0, max: 20, step: 1 },
  { key: "radius", label: "Radius", min: 0, max: 110, step: 2 },
  { key: "tint", label: "Tint", min: 0, max: 0.6, step: 0.05 },
];

const LENS = 200;

export function Playground() {
  const [s, setS] = useState(DEFAULTS);
  const [pos, setPos] = useState({ x: 30, y: 40 });
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !stage.current) return;
    const b = stage.current.getBoundingClientRect();
    setPos({
      x: Math.min(Math.max(e.clientX - drag.current.dx, 0), b.width - LENS),
      y: Math.min(Math.max(e.clientY - drag.current.dy, 0), b.height - LENS),
    });
  };
  const onUp = () => (drag.current = null);

  return (
    <div className="grid w-full max-w-5xl gap-4 lg:grid-cols-[1fr_300px]">
      <div ref={stage} className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 sm:h-[480px]">
        <div
          className="absolute inset-0"
          style={{ background: "repeating-linear-gradient(45deg,#f43f5e 0 18px,#fde047 18px 36px,#22d3ee 36px 54px,#0f172a 54px 72px)" }}
        />
        <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
          The quick brown fox jumps over the lazy dog
        </p>
        <div
          className="absolute left-0 top-0 touch-none select-none"
          style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, cursor: "grab" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <GlassElement
            width={LENS}
            height={LENS}
            radius={s.radius}
            depth={s.depth}
            blur={s.blur}
            strength={s.strength}
            chromaticAberration={s.chromaticAberration}
            backgroundColor={`rgba(255,255,255,${s.tint})`}
            debug={s.debug}
            pressable={false}
          >
            <span className="text-xs font-semibold uppercase tracking-widest drop-shadow">drag me</span>
          </GlassElement>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-black/35 p-5">
        {SLIDERS.map(({ key, label, min, max, step }) => (
          <label key={key} className="block text-sm">
            <div className="mb-1 flex justify-between">
              <span>{label}</span>
              <span className="font-mono text-white/80">{s[key]}</span>
            </div>
            <input
              type="range"
              className="glass-range"
              min={min}
              max={max}
              step={step}
              value={s[key]}
              onChange={(e) => setS({ ...s, [key]: Number(e.target.value) })}
            />
          </label>
        ))}
        <label className="flex items-center justify-between text-sm">
          Show displacement map
          <input type="checkbox" className="h-5 w-5" checked={s.debug} onChange={(e) => setS({ ...s, debug: e.target.checked })} />
        </label>
        <button onClick={() => setS(DEFAULTS)} className="rounded-full bg-white/20 py-2 text-sm font-medium hover:bg-white/30">
          Reset
        </button>
      </div>
    </div>
  );
}
