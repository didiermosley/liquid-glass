import { CSSGlass } from "@/components/CSSGlass";

const NOTES = [
  { app: "Messages", body: "Your glass is ready 🥂", c: "bg-emerald-400" },
  { app: "Calendar", body: "Design review in 10 min", c: "bg-rose-400" },
];

export default function Page() {
  return (
    <>
      <h1 className="mb-1 text-3xl font-semibold tracking-tight">CSS glass</h1>
      <p className="mb-8 text-sm text-white/70">Blur + rim light + pointer specular. No SVG filters; smooth on iOS and low-end phones.</p>
      <div className="flex w-full max-w-md flex-col gap-5">
        <CSSGlass radius={32} className="p-6">
          <div className="text-xl font-semibold">Glass card</div>
          <p className="mt-1 text-sm text-white/80">Move your finger or cursor across it and the highlight follows.</p>
          <div className="mt-5 flex gap-3">
            <CSSGlass radius={999} tint={0.22} className="px-5 py-2 text-sm font-semibold">
              Primary
            </CSSGlass>
            <CSSGlass radius={999} tint={0.05} className="px-5 py-2 text-sm font-semibold">
              Clear
            </CSSGlass>
          </div>
        </CSSGlass>
        {NOTES.map((n) => (
          <CSSGlass key={n.app} radius={22} blur={14} className="flex items-center gap-3 px-4 py-3">
            <span className={`h-9 w-9 shrink-0 rounded-xl ${n.c}`} />
            <div>
              <div className="text-xs uppercase tracking-wider text-white/70">{n.app}</div>
              <div className="text-sm font-medium">{n.body}</div>
            </div>
          </CSSGlass>
        ))}
      </div>
    </>
  );
}
