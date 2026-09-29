"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
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
  style?: CSSProperties;
  children?: ReactNode;
}

const INSET_SHADOW =
  "1px 1px 1px 0px rgba(255,255,255,0.60) inset, -1px -1px 1px 0px rgba(255,255,255,0.60) inset, 0px 0px 16px 0px rgba(0,0,0,0.04)";

// Only Chromium supports SVG filters inside backdrop-filter.
function detectSVGFilterSupport() {
  if (typeof CSS === "undefined" || !CSS.supports("backdrop-filter", "blur(1px)")) return false;
  const ua = navigator.userAgent.toLowerCase();
  return /chrome|chromium|crios|edg/.test(ua) && !/firefox|fxios/.test(ua);
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
  style,
  children,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  ...rest
}: GlassElementProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
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
    if (!clicked) return;
    const release = () => setClicked(false);
    document.addEventListener("mouseup", release);
    return () => document.removeEventListener("mouseup", release);
  }, [clicked]);

  // Auto-size: the box sizes itself to its content; the filter is regenerated to match.
  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    if (!autoSize || !el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const w = Math.max(Math.ceil(rect.width), minWidth, 50);
      const h = Math.max(Math.ceil(rect.height), minHeight, 30);
      setMeasured((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoSize, minWidth, minHeight]);

  const w = autoSize ? measured?.w : Math.round((baseWidth ?? width) * scale);
  const h = autoSize ? measured?.h : Math.round((baseHeight ?? height) * scale);
  const depth = baseDepth / (clicked ? 0.7 : 1);

  const dynamic: CSSProperties = { borderRadius: radius };
  if (!autoSize) {
    dynamic.width = w;
    dynamic.height = h;
  }

  if (w && h && svgSupport !== null) {
    if (debug) {
      dynamic.background = `url("${getDisplacementMap({ height: h, width: w, radius, depth })}")`;
      dynamic.boxShadow = "none";
    } else if (!svgSupport) {
      dynamic.backdropFilter = `blur(${blur * 2}px)`;
      dynamic.background = backgroundColor;
      dynamic.border = "1px solid rgba(255, 255, 255, 0.3)";
    } else {
      const filter = getDisplacementFilter({ height: h, width: w, radius, depth, strength, chromaticAberration });
      dynamic.backdropFilter = `blur(${blur / 2}px) url('${filter}') blur(${blur}px) brightness(1.1) saturate(1.5)`;
      dynamic.background = backgroundColor;
    }
  }

  return (
    <div
      {...rest}
      ref={boxRef}
      onMouseDown={(e) => {
        setClicked(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setClicked(false);
        onMouseUp?.(e);
      }}
      onMouseLeave={(e) => {
        setClicked(false);
        onMouseLeave?.(e);
      }}
      style={{
        position: "relative",
        display: autoSize ? "inline-block" : "block",
        width: autoSize ? "fit-content" : undefined,
        minWidth: autoSize ? minWidth : undefined,
        minHeight: autoSize ? minHeight : undefined,
        background: "rgba(255, 255, 255, 0.4)",
        boxShadow: INSET_SHADOW,
        cursor: "pointer",
        transition: "transform 0.1s ease",
        transform: clicked ? "scale(0.98)" : undefined,
        ...dynamic,
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
        }}
      >
        {children}
      </div>
    </div>
  );
}
