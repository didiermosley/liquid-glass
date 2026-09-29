import { GlassElement } from "@/components/GlassElement";

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-10 overflow-hidden p-8"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, #f472b6 0, transparent 40%), radial-gradient(circle at 80% 30%, #38bdf8 0, transparent 45%), radial-gradient(circle at 50% 90%, #facc15 0, transparent 40%), linear-gradient(135deg, #1e1b4b, #0f172a)",
      }}
    >
      <h1 className="text-4xl font-semibold tracking-tight text-white">Liquid Glass</h1>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <GlassElement width={96} height={96} radius={48} depth={5} blur={1} strength={40} chromaticAberration={2}>
          <span className="text-3xl">⭐</span>
        </GlassElement>

        <GlassElement autoSize radius={32} depth={8} blur={2} strength={60} chromaticAberration={3} padding="16px 32px">
          <span className="text-lg font-medium">Auto-sized button</span>
        </GlassElement>

        <GlassElement width={260} height={140} radius={40} depth={10} strength={100} chromaticAberration={4}>
          <span className="font-medium">Fixed size card</span>
        </GlassElement>
      </div>

      <p className="text-sm text-white/70">Best in Chromium; other browsers get a blur fallback.</p>
    </main>
  );
}
