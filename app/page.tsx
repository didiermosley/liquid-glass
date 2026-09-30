import Link from "next/link";
import { GlassElement } from "@/components/GlassElement";
import { CSSGlass } from "@/components/CSSGlass";

export default function Home() {
  return (
    <div className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
      <h1 className="text-5xl font-bold tracking-tighter drop-shadow-lg sm:text-7xl">Liquid Glass</h1>
      <p className="max-w-md text-white/80">
        Two implementations: SVG refraction (Chromium/Android) and pure-CSS glass (everywhere). One demo per page to keep it smooth.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/playground">
          <GlassElement autoSize radius={999} depth={8} strength={60} padding="14px 28px" backgroundColor="rgba(255,255,255,0.15)">
            <span className="font-semibold">Refraction lens →</span>
          </GlassElement>
        </Link>
        <Link href="/css">
          <CSSGlass radius={999} className="px-7 py-3.5 font-semibold">
            CSS glass →
          </CSSGlass>
        </Link>
      </div>
    </div>
  );
}
