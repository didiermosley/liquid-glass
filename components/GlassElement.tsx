"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getDisplacementFilter, getDisplacementMap } from "@/lib/displacement";

export interface GlassElementProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  width?: number;
  height?: number;
  radius?: number;
  depth?: number;
  blur?: number;
  strength?: number;
  chromaticAberration?: number;
  backgroundColor?: string;
  debug?: boolean;
  responsive?: boolean;
  baseWidth?: number;
  baseHeight?: number;
  autoSize?: boolean;
  minWidth?: number;
  minHeight?: number;
  /** Padding applied to the content when `autoSize` is on. */
  padding?: string;
  /** Scale down slightly and deepen the lens while pressed. */
  pressable?: boolean;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
  children?: ReactNode;
}

const INSET_SHADOW =
  "1px 1px 1px 0px rgba(255,255,255,0.60) inset, -1px -1px 1px 0px rgba(255,255,255,0.60) inset, 0px 8px 32px 0px rgba(0,0,0,0.12)";

// Only Chromium (not WebKit-based iOS browsers) supports SVG filters inside backdrop-filter.
function detectSVGFilterSupport() {
  if (typeof CSS === "undefined" || !CSS.supports("backdrop-filter", "blur(1px)")) return false;
  const ua = navigator.userAgent.toLowerCase();
  return /chrome|chromium|edg/.test(ua) && !/firefox|fxios|crios|edgios/.test(ua);
}

const subscribeNever = () => () => {};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function GlassElement({
  width = 200,
  height = 200,
  radius = 50,
  depth: baseDepth = 10,
  blur = 2,
  strength = 100,
  chromaticAberration = 0,
  backgroundColor = "rgba(255, 255, 255, 0.4)",
  debug = false,
  responsive = false,
  baseWidth,
  baseHeight,
  autoSize = false,
  minWidth = 0,
  minHeight = 0,
  padding = "16px 24px",
  pressable = true,
  style,
  contentStyle,
  children,
  onPointerDown,
  ...rest
}: GlassElementProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);
  const svgSupport = useSyncExternalStore(subscribeNever, detectSVGFilterSupport, () => null);
  const [scale, setScale] = useState(1);
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!responsive) return;
    const update = () => {
      const vw = window.innerWidth;
      setScale(vw < 480 ? 0.6 : vw < 768 ? 0.8 : vw < 1024 ? 0.9 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [responsive]);

  useEffect(() => {
    if (!pressed) return;
    const release = () => setPressed(false);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", release);
    return () => {
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", release);
    };
  }, [pressed]);

  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      if (!el.offsetWidth || !el.offsetHeight) return;
      const w = Math.max(el.offsetWidth, minWidth);
      const h = Math.max(el.offsetHeight, minHeight);
      setMeasured((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [minWidth, minHeight]);

  const boxW = Math.round((baseWidth ?? width) * scale);
  const boxH = Math.round((baseHeight ?? height) * scale);
  const w = measured?.w ?? (autoSize ? undefined : boxW);
  const h = measured?.h ?? (autoSize ? undefined : boxH);
  const r = w && h ? Math.min(radius, w / 2, h / 2) : radius;
  const depth = baseDepth / (pressed ? 0.7 : 1);

  const effect = useMemo<CSSProperties | null>(() => {
    if (!w || !h || svgSupport === null) return null;
    if (debug) {
      return { background: `url("${getDisplacementMap({ height: h, width: w, radius: r, depth })}")`, boxShadow: "none" };
    }
    if (!svgSupport) {
      const backdropFilter = `blur(${Math.max(blur * 4, 8)}px) saturate(1.6)`;
      return { backdropFilter, WebkitBackdropFilter: backdropFilter, background: backgroundColor };
    }
    const filter = getDisplacementFilter({ height: h, width: w, radius: r, depth, strength, chromaticAberration });
    return {
      backdropFilter: `blur(${blur / 2}px) url("${filter}") blur(${blur}px) brightness(1.1) saturate(1.5)`,
      background: backgroundColor,
    };
  }, [w, h, r, depth, blur, strength, chromaticAberration, backgroundColor, debug, svgSupport]);

  return (
    <div
      {...rest}
      ref={boxRef}
      onPointerDown={(e) => {
        if (pressable) setPressed(true);
        onPointerDown?.(e);
      }}
      style={{
        position: "relative",
        display: autoSize ? "inline-block" : "block",
        width: autoSize ? "fit-content" : boxW,
        height: autoSize ? undefined : boxH,
        minWidth: autoSize ? minWidth : undefined,
        minHeight: autoSize ? minHeight : undefined,
        borderRadius: r,
        background: backgroundColor,
        boxShadow: INSET_SHADOW,
        cursor: pressable ? "pointer" : undefined,
        transition: "transform 0.15s ease",
        transform: pressed ? "scale(0.97)" : undefined,
        touchAction: "manipulation",
        ...effect,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          width: autoSize ? undefined : "100%",
          height: autoSize ? undefined : "100%",
          padding: autoSize ? padding : undefined,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
