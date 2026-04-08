/** Placeholder uplinks when `PROJECTS` is empty — used on home `#works` */
export function WorksEmptySlots() {
  const slots = [1, 2, 3];
  return (
    <div className="mt-12 grid w-full max-w-5xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {slots.map((i) => (
        <div
          key={i}
          className="relative flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-400/20 bg-white/[0.02] px-6 py-10 text-center"
        >
          <div
            className="mb-4 h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
            aria-hidden
          />
          <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-400/50">
            UPLINK {String(i).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm text-[#64748b]">Awaiting transmission</p>
          <p className="mt-4 max-w-[220px] font-mono text-[11px] leading-relaxed text-[#475569]">
            Add entries in{" "}
            <code className="text-cyan-600/80">lib/projects.ts</code>
          </p>
        </div>
      ))}
    </div>
  );
}
