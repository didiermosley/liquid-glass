import { Playground } from "@/components/Playground";

export default function Page() {
  return (
    <>
      <h1 className="mb-1 text-3xl font-semibold tracking-tight">Refraction lens</h1>
      <p className="mb-6 text-sm text-white/70">SVG displacement. Full effect in Chrome/Edge/Android; frosted fallback elsewhere.</p>
      <Playground />
    </>
  );
}
