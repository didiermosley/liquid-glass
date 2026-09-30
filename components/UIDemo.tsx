"use client";

import { useState } from "react";
import { GlassElement } from "@/components/GlassElement";

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
      backgroundColor={on ? "rgba(52,211,153,0.55)" : "rgba(255,255,255,0.15)"}
      onClick={() => onChange(!on)}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onChange(!on))}
      contentStyle={{ justifyContent: "flex-start", padding: 3 }}
    >
      <span className="block h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200" style={{ transform: on ? "translateX(30px)" : "none" }} />
    </GlassElement>
  );
}

const BUTTONS = [
  { l: "Primary", bg: "rgba(59,130,246,0.45)" },
  { l: "Success", bg: "rgba(16,185,129,0.45)" },
  { l: "Danger", bg: "rgba(244,63,94,0.45)" },
];

export function UIDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {BUTTONS.map((x) => (
          <GlassElement key={x.l} autoSize radius={16} depth={6} strength={50} padding="12px 24px" backgroundColor={x.bg} onClick={() => setCount((c) => c + 1)}>
            <span className="font-semibold">{x.l}</span>
          </GlassElement>
        ))}
      </div>
      <p className="text-sm text-white/70">Pressed {count}×</p>
      <div className="flex items-center gap-6">
        <Toggle label="Wi-Fi" on={a} onChange={setA} />
        <Toggle label="Focus" on={b} onChange={setB} />
      </div>
    </div>
  );
}
