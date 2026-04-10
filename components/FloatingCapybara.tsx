"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** ~70% of astronaut floater — capybaras read smaller on screen */
const CAPY_FRAME =
  "relative h-[min(196px,30vh)] w-[min(154px,28vw)] max-w-[182px]";

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Drift toward the last “noticed” point — keep low for slow, floaty motion (not snappy). */
const PURSUIT_LERP = 0.009;

/** Only occasionally picks a new goal from the cursor — not every move. */
const NOTICE_MIN_MS = 1600;
const NOTICE_MAX_MS = 5200;
/** Probability each tick that the capy “notices” the pointer and updates its goal. */
const CHANCE_TO_NOTICE = 0.52;

export type FloatingCapybaraProps = {
  /** Match astronaut: hide during section morphs / certain views */
  suppress?: boolean;
};

export function FloatingCapybara({ suppress = false }: FloatingCapybaraProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  /** Live cursor — updated every move; goal only copies here sometimes. */
  const pointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = w * 0.22;
    const y = h * 0.28;
    posRef.current = { x, y };
    targetRef.current = { x, y };
    pointerRef.current = { x, y };
    const el = wrapRef.current;
    if (el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  }, []);

  useEffect(() => {
    if (reduceMotion || suppress) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (noticeTimerRef.current !== null) {
        clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = null;
      }
      return;
    }

    const scheduleNotice = () => {
      noticeTimerRef.current = window.setTimeout(() => {
        if (Math.random() < CHANCE_TO_NOTICE) {
          const p = pointerRef.current;
          targetRef.current = { x: p.x, y: p.y };
        }
        scheduleNotice();
      }, randomInRange(NOTICE_MIN_MS, NOTICE_MAX_MS));
    };
    scheduleNotice();

    const loop = () => {
      const { x: px, y: py } = posRef.current;
      const { x: tx, y: ty } = targetRef.current;
      const nx = px + (tx - px) * PURSUIT_LERP;
      const ny = py + (ty - py) * PURSUIT_LERP;
      posRef.current = { x: nx, y: ny };
      const el = wrapRef.current;
      if (el) {
        el.style.left = `${nx}px`;
        el.style.top = `${ny}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    const onMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (noticeTimerRef.current !== null) {
        clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = null;
      }
    };
  }, [reduceMotion, suppress]);

  const fadeOut = suppress;

  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-[7] overflow-hidden"
        aria-hidden
      >
        <div
          className={`absolute will-change-[left,top,transform,opacity] ${
            fadeOut ? "opacity-0" : "opacity-100"
          } ${fadeOut ? "duration-[900ms] ease-out" : ""}`}
          style={{
            left: "18%",
            top: "72%",
            transform: "translate(-50%, -50%)",
            transition: fadeOut ? "opacity 900ms ease-out" : undefined,
          }}
        >
          <div className="relative drop-shadow-[0_0_28px_rgba(103,232,249,0.35)]">
            <div className={CAPY_FRAME}>
              <Image
                src="/assets/capy1.png"
                alt=""
                fill
                sizes="(max-width: 640px) 28vw, 182px"
                className="object-contain object-center"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[7] overflow-hidden"
      aria-hidden
    >
      <div
        ref={wrapRef}
        className={`absolute will-change-[left,top,transform,opacity] ${
          fadeOut ? "opacity-0" : "opacity-100"
        } ${fadeOut ? "duration-[900ms] ease-out" : ""}`}
        style={{
          transform: fadeOut
            ? "translate(-50%, -50%) scale(0.28)"
            : "translate(-50%, -50%)",
          transition: fadeOut
            ? "transform 900ms cubic-bezier(0.4, 0, 0.2, 1), opacity 900ms ease-out"
            : undefined,
        }}
      >
        <div className="astronaut-float-drift relative drop-shadow-[0_0_28px_rgba(103,232,249,0.35)]">
          <div className={CAPY_FRAME}>
            <Image
              src="/assets/capy1.png"
              alt=""
              fill
              sizes="(max-width: 640px) 28vw, 182px"
              className="object-contain object-center"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
