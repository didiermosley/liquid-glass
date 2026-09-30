import { GlassElement } from "@/components/GlassElement";

export default function Page() {
  return (
    <>
      <h1 className="mb-1 text-3xl font-semibold tracking-tight">Cards</h1>
      <p className="mb-8 text-sm text-white/70">Two glass elements on this page.</p>
      <div className="flex w-full max-w-md flex-col gap-6">
        <GlassElement width={420} height={150} radius={32} depth={10} strength={90} pressable={false} backgroundColor="rgba(15,23,42,0.25)" style={{ width: "100%" }}>
          <div className="flex w-full items-center gap-4 p-5 text-left">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400" />
            <div>
              <div className="font-semibold">Midnight Refraction</div>
              <div className="text-sm text-white/70">The Displacements</div>
            </div>
          </div>
        </GlassElement>
        <GlassElement width={420} height={80} radius={24} depth={6} strength={60} pressable={false} backgroundColor="rgba(255,255,255,0.14)" style={{ width: "100%" }}>
          <div className="flex w-full items-center gap-3 px-5 text-left">
            <span className="h-10 w-10 shrink-0 rounded-xl bg-emerald-400" />
            <div>
              <div className="text-xs uppercase tracking-wider text-white/70">Messages</div>
              <div className="text-sm font-medium">Your glass is ready 🥂</div>
            </div>
          </div>
        </GlassElement>
      </div>
    </>
  );
}
