const WORDS = ["REFRACTION", "DISPLACEMENT", "CHROMATIC", "LIQUID", "GLASS", "LENS", "BLUR", "DEPTH"];

export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1b4b,#05060f_70%)]" />
      <div className="blob blob-a left-[-10%] top-[-10%] h-[55vmax] w-[55vmax] bg-[radial-gradient(circle,#f472b6,transparent_65%)]" />
      <div className="blob blob-b right-[-15%] top-[10%] h-[50vmax] w-[50vmax] bg-[radial-gradient(circle,#38bdf8,transparent_65%)]" />
      <div className="blob blob-c bottom-[-20%] left-[20%] h-[55vmax] w-[55vmax] bg-[radial-gradient(circle,#a3e635,transparent_60%)]" />
      <div className="blob blob-a bottom-[5%] right-[5%] h-[30vmax] w-[30vmax] bg-[radial-gradient(circle,#f97316,transparent_65%)]" />
      <div className="bg-grid absolute inset-0" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 overflow-hidden opacity-20">
        <div className="marquee flex w-max whitespace-nowrap text-[14vw] font-black leading-none tracking-tighter text-white">
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="px-8">
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
