export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundColor: "#05060f",
        backgroundImage: [
          "radial-gradient(circle at 15% 15%, rgba(244,114,182,0.95), transparent 38%)",
          "radial-gradient(circle at 85% 25%, rgba(56,189,248,0.95), transparent 40%)",
          "radial-gradient(circle at 30% 85%, rgba(163,230,53,0.85), transparent 38%)",
          "radial-gradient(circle at 90% 90%, rgba(249,115,22,0.9), transparent 35%)",
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "auto, auto, auto, auto, 48px 48px, 48px 48px",
      }}
    />
  );
}
