"use client";

import type { CSSProperties, HTMLAttributes, PointerEvent, ReactNode } from "react";

export interface CSSGlassProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  radius?: number;
  blur?: number;
  saturate?: number;
  /** 0–1 white tint of the pane. */
  tint?: number;
  /** Specular highlight follows the pointer. */
  specular?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Pure-CSS glass: backdrop blur + saturation, rim light, and a pointer-tracked
 * specular highlight. No SVG filters, so it is fast and works in every browser
 * (including Safari / iOS). No true refraction; use GlassElement for that.
 */
export function CSSGlass({
  radius = 28,
  blur = 18,
  saturate = 1.7,
  tint = 0.12,
  specular = true,
  style,
  children,
  onPointerMove,
  ...rest
}: CSSGlassProps) {
  const filter = `blur(${blur}px) saturate(${saturate}) brightness(1.06)`;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (specular) {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
      e.currentTarget.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    }
    onPointerMove?.(e);
  };

  return (
    <div
      {...rest}
      onPointerMove={handleMove}
      style={{
        position: "relative",
        isolation: "isolate",
        borderRadius: radius,
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
        background: `linear-gradient(135deg, rgba(255,255,255,${tint + 0.1}), rgba(255,255,255,${tint * 0.35}))`,
        border: "1px solid rgba(255,255,255,0.28)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.12), inset 0 0 18px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.22)",
        color: "white",
        ["--sx" as string]: "30%",
        ["--sy" as string]: "0%",
        ...style,
      }}
    >
      {specular && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: -1,
            background: "radial-gradient(circle at var(--sx) var(--sy), rgba(255,255,255,0.35), transparent 55%)",
          }}
        />
      )}
      {children}
    </div>
  );
}
