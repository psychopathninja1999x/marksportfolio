"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "a Mobile App Developer",
  "a Web Developer",
  "a Volunteer",
  "a Friend",
] as const;

const TYPE_MS = 52;
const DELETE_MS = 32;
const PAUSE_AFTER_FULL_MS = 2200;
const PAUSE_BEFORE_NEXT_MS = 380;

type Phase = "typing" | "deleting";

export function RotatingRoles() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [paused, setPaused] = useState(false);

  const current = ROLES[roleIndex];
  const displayed = current.slice(0, visibleLength);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPaused(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused) return;

    const full = ROLES[roleIndex];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (visibleLength < full.length) {
        t = setTimeout(() => setVisibleLength((n) => n + 1), TYPE_MS);
      } else {
        t = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_FULL_MS);
      }
    } else {
      if (visibleLength > 0) {
        t = setTimeout(() => setVisibleLength((n) => n - 1), DELETE_MS);
      } else {
        t = setTimeout(() => {
          setRoleIndex((i) => (i + 1) % ROLES.length);
          setPhase("typing");
        }, PAUSE_BEFORE_NEXT_MS);
      }
    }

    return () => clearTimeout(t);
  }, [roleIndex, visibleLength, phase, paused]);

  const showStatic = paused;

  return (
    <div className="rotating-role-wrap mt-6 flex flex-col items-center gap-3 md:mt-8">
      <div
        className="h-px w-20 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent md:w-28"
        aria-hidden
      />
      <p
        className="rotating-role-line max-w-[100vw] min-h-[1.75em] whitespace-nowrap px-2 text-center font-mono text-[clamp(0.68rem,2.6vw,1rem)] leading-tight tracking-[0.1em] text-[#94a3b8] sm:tracking-[0.14em]"
        aria-live="off"
      >
        <span className="rotating-role-text">
          {showStatic ? ROLES[0] : displayed}
        </span>
        {!showStatic && (
          <span className="typewriter-cursor" aria-hidden />
        )}
      </p>
    </div>
  );
}
