"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { GlassElement } from "@/components/GlassElement";

interface Settings {
  strength: number;
  depth: number;
  blur: number;
  chromaticAberration: number;
  radius: number;
  tint: number;
  debug: boolean;
}

const DEFAULTS: Settings = { strength: 100, depth: 10, blur: 2, chromaticAberration: 4, radius: 60, tint: 0.15, debug: false };

const SLIDERS: { key: Exclude<keyof Settings, "debug">; label: string; min: number; max: number; step: number }[] = [
  { key: "strength", label: "Strength", min: 0, max: 300, step: 5 },
  { key: "depth", label: "Depth", min: 1, max: 40, step: 1 },
  { key: "blur", label: "Blur", min: 0, max: 10, step: 0.5 },
  { key: "chromaticAberration", label: "Chromatic", min: 0, max: 20, step: 1 },
  { key: "radius", label: "Radius", min: 0, max: 110, step: 2 },
  { key: "tint", label: "Tint", min: 0, max: 0.6, step: 0.05 },
];

const TILES = [
  "from-rose-500 to-orange-400",
  "from-sky-500 to-indigo-500",
  "from-lime-400 to-emerald-600",
  "from-fuchsia-500 to-purple-700",
  "from-amber-300 to-red-500",
  "from-cyan-300 to-blue-700",
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <GlassElement
      role="switch"
      aria-checked={on}
      aria-label={label}
      tabIndex={0}
      width={64}
      height={34}
      radius={17}
      depth={4}
      strength={40}
      chromaticAberration={2}
      backgroundColor={on ? "rgba(52, 211, 153, 0.55)" : "rgba(255,255,255,0.15)"}
      onClick={() => onChange(!on)}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onChange(!on))}
      contentStyle={{ justifyContent: "flex-start", padding: 3 }}
    >
      <span
        className="block h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: on ? "translateX(30px)" : "translateX(0)" }}
      />
    </GlassElement>
  );
}

function DraggableLens({ settings, children }: { settings: Settings; children?: ReactNode }) {
  const [pos, setPos] = useState({ x: 40, y: 60 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const parent = e.currentTarget.parentElement!.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - drag.current.dx, 0), parent.width - 220);
    const y = Math.min(Math.max(e.clientY - drag.current.dy, 0), parent.height - 220);
    setPos({ x, y });
  };
  const onUp = () => (drag.current = null);

  return (
    <div
      className="absolute left-0 top-0 touch-none select-none"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, cursor: "grab" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <GlassElement
        width={220}
        height={220}
        radius={settings.radius}
        depth={settings.depth}
        blur={settings.blur}
        strength={settings.strength}
        chromaticAberration={settings.chromaticAberration}
        backgroundColor={`rgba(255,255,255,${settings.tint})`}
        debug={settings.debug}
      >
        {children}
      </GlassElement>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-2 text-white/70">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Playground() {
  const [s, setS] = useState(DEFAULTS);
  const [wifi, setWifi] = useState(true);
  const [focus, setFocus] = useState(false);
  const [tab, setTab] = useState("Day");
  const [playing, setPlaying] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <>
      <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <GlassElement autoSize radius={999} depth={8} blur={2} strength={70} chromaticAberration={3} padding="10px 12px" pressable={false} backgroundColor="rgba(255,255,255,0.12)">
          <div className="flex items-center gap-1 text-sm font-medium sm:gap-2">
            <span className="hidden whitespace-nowrap px-3 font-semibold sm:inline">◎ Liquid</span>
            {["Playground", "Components", "Scroll"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-white/20">
                {l}
              </a>
            ))}
          </div>
        </GlassElement>
      </nav>

      <header className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4 pt-24 text-center">
        <h1 className="text-6xl font-bold tracking-tighter text-white drop-shadow-lg sm:text-8xl">Liquid Glass</h1>
        <p className="max-w-xl text-lg text-white/80">
          Real refraction via SVG displacement inside <code className="font-mono">backdrop-filter</code>. Chromium renders the full lens; other browsers get a frosted fallback.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <GlassElement autoSize radius={999} depth={8} strength={60} chromaticAberration={3} padding="14px 30px" onClick={() => document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })}>
            <span className="text-lg font-semibold">Try the lens →</span>
          </GlassElement>
          <GlassElement autoSize radius={999} depth={8} strength={60} chromaticAberration={3} padding="14px 30px" backgroundColor="rgba(244,114,182,0.35)" onClick={() => setCount((c) => c + 1)}>
            <span className="text-lg font-semibold">Clicked {count}×</span>
          </GlassElement>
        </div>
      </header>

      <div id="playground">
        <Section title="Playground" subtitle="Drag the lens over the busy content and tune the parameters live.">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="relative h-[480px] overflow-hidden rounded-3xl border border-white/10">
              <div className="stripes absolute inset-0 opacity-90" />
              <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6">
                {TILES.map((t, i) => (
                  <div key={t} className={`flex items-end rounded-2xl bg-gradient-to-br p-4 ${t}`}>
                    <span className="text-2xl font-black text-white drop-shadow">0{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
                The quick brown fox jumps over the lazy dog
              </p>
              <DraggableLens settings={s}>
                <span className="text-sm font-semibold uppercase tracking-widest drop-shadow">drag me</span>
              </DraggableLens>
            </div>

            <GlassElement width={320} height={480} radius={32} depth={10} blur={3} strength={80} chromaticAberration={2} pressable={false} backgroundColor="rgba(255,255,255,0.1)" style={{ width: "100%" }}>
              <div className="flex h-full w-full flex-col gap-4 p-6 text-left">
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
                <div className="mt-auto flex items-center justify-between text-sm">
                  <span>Show displacement map</span>
                  <Toggle label="Debug" on={s.debug} onChange={(debug) => setS({ ...s, debug })} />
                </div>
                <button onClick={() => setS(DEFAULTS)} className="rounded-full bg-white/20 py-2 text-sm font-medium transition hover:bg-white/30">
                  Reset
                </button>
              </div>
            </GlassElement>
          </div>
        </Section>
      </div>

      <div id="components">
        <Section title="Components" subtitle="Common UI built on the same element.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GlassElement width={340} height={220} radius={32} depth={10} strength={90} chromaticAberration={3} pressable={false} backgroundColor="rgba(255,255,255,0.12)" style={{ width: "100%" }}>
              <div className="flex w-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Wi-Fi</span>
                  <Toggle label="Wi-Fi" on={wifi} onChange={setWifi} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Focus mode</span>
                  <Toggle label="Focus mode" on={focus} onChange={setFocus} />
                </div>
                <div className="flex rounded-full bg-black/20 p-1 text-sm">
                  {["Day", "Week", "Month"].map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-1.5 transition ${tab === t ? "bg-white/35 font-semibold" : "hover:bg-white/10"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </GlassElement>

            <GlassElement width={340} height={220} radius={32} depth={12} strength={110} chromaticAberration={5} pressable={false} backgroundColor="rgba(15,23,42,0.25)" style={{ width: "100%" }}>
              <div className="flex w-full flex-col gap-4 p-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400 shadow-lg" />
                  <div>
                    <div className="font-semibold">Midnight Refraction</div>
                    <div className="text-sm text-white/70">The Displacements</div>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: playing ? "62%" : "38%" }} />
                </div>
                <div className="flex items-center justify-center gap-4">
                  {["⏮", playing ? "⏸" : "▶", "⏭"].map((icon, i) => (
                    <GlassElement key={i} width={48} height={48} radius={24} depth={4} strength={40} chromaticAberration={2} backgroundColor="rgba(255,255,255,0.15)" onClick={() => i === 1 && setPlaying(!playing)}>
                      <span className="text-lg">{icon}</span>
                    </GlassElement>
                  ))}
                </div>
              </div>
            </GlassElement>

            <div className="flex flex-col gap-4">
              {[
                { app: "Messages", body: "Your glass is ready 🥂", c: "bg-emerald-400" },
                { app: "Calendar", body: "Design review in 10 min", c: "bg-rose-400" },
                { app: "Weather", body: "Clear skies · 24°", c: "bg-sky-400" },
              ].map((n) => (
                <GlassElement key={n.app} width={340} height={66} radius={22} depth={6} strength={60} chromaticAberration={2} backgroundColor="rgba(255,255,255,0.14)" style={{ width: "100%" }}>
                  <div className="flex w-full items-center gap-3 px-4 text-left">
                    <span className={`h-9 w-9 shrink-0 rounded-xl ${n.c}`} />
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-white/70">{n.app}</div>
                      <div className="truncate text-sm font-medium">{n.body}</div>
                    </div>
                  </div>
                </GlassElement>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {[
              { l: "Primary", bg: "rgba(59,130,246,0.45)" },
              { l: "Success", bg: "rgba(16,185,129,0.45)" },
              { l: "Danger", bg: "rgba(244,63,94,0.45)" },
              { l: "Clear", bg: "rgba(255,255,255,0.08)" },
            ].map((b) => (
              <GlassElement key={b.l} autoSize radius={16} depth={6} strength={50} chromaticAberration={2} padding="12px 24px" backgroundColor={b.bg}>
                <span className="font-semibold">{b.l}</span>
              </GlassElement>
            ))}
            {[40, 64, 96].map((d) => (
              <GlassElement key={d} width={d} height={d} radius={d / 2} depth={d / 12} strength={d} chromaticAberration={2}>
                <span style={{ fontSize: d / 2.5 }}>✦</span>
              </GlassElement>
            ))}
          </div>
        </Section>
      </div>

      <div id="scroll">
        <Section title="Scroll test" subtitle="Scroll so this content passes beneath the fixed nav and dock.">
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`rounded-3xl bg-gradient-to-br p-8 ${TILES[i]}`}>
                <h3 className="text-2xl font-bold text-white">Layer {i + 1}</h3>
                <p className="mt-2 text-white/90">
                  High-contrast edges and saturated colours make the refraction at the rim of each lens easy to see. Watch the text bend as it slides under the glass.
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="h-32" />

      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <GlassElement autoSize radius={28} depth={10} blur={2} strength={90} chromaticAberration={3} padding="10px" pressable={false} backgroundColor="rgba(255,255,255,0.14)">
          <div className="flex gap-2 sm:gap-3">
            {["🧭", "💬", "📷", "🎵", "⚙️"].map((e) => (
              <GlassElement key={e} width={52} height={52} radius={16} depth={5} strength={40} chromaticAberration={2} backgroundColor="rgba(255,255,255,0.2)">
                <span className="text-2xl">{e}</span>
              </GlassElement>
            ))}
          </div>
        </GlassElement>
      </div>
    </>
  );
}
