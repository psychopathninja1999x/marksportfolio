"use client";

type ViewWorksButtonProps = {
  onLaunch: () => void;
  launching: boolean;
};

export function ViewWorksButton({ onLaunch, launching }: ViewWorksButtonProps) {
  return (
    <button
      type="button"
      onClick={onLaunch}
      disabled={launching}
      aria-busy={launching}
      aria-label={launching ? "Launching" : "Launch to About Me"}
      className="group relative mt-10 inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-400/25 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-8 py-3.5 text-sm font-medium tracking-[0.14em] text-[#e8eaef] shadow-[0_0_28px_rgba(103,232,249,0.12)] transition-all duration-300 hover:border-cyan-300/45 hover:shadow-[0_0_40px_rgba(103,232,249,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-80"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative">
        {launching ? "Launching…" : "Launch"}
      </span>
      <span
        className="relative text-cyan-300/90 transition-transform duration-300 group-hover:translate-y-0.5"
        aria-hidden
      >
        ↓
      </span>
    </button>
  );
}
