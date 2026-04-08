"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const MIN_INTERVAL_MS = 8000;
const MAX_INTERVAL_MS = 16000;
const TRANSITION_S = 14;

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export type FloatingAstronautProps = {
  /** Hide floater while About is primary or during FLIP flight */
  suppress?: boolean;
};

export const FloatingAstronaut = forwardRef<HTMLDivElement, FloatingAstronautProps>(
  function FloatingAstronaut({ suppress = false }, ref) {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [pos, setPos] = useState({ x: 22, y: 28 });
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const apply = () => setReduceMotion(mq.matches);
      apply();
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }, []);

    const scheduleNext = useCallback(() => {
      setPos({
        x: randomInRange(8, 92),
        y: randomInRange(10, 85),
      });
      const delay = randomInRange(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
      timerRef.current = window.setTimeout(scheduleNext, delay);
    }, []);

    useEffect(() => {
      if (reduceMotion || suppress) {
        if (timerRef.current) clearTimeout(timerRef.current);
        return;
      }
      timerRef.current = window.setTimeout(scheduleNext, 600);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [reduceMotion, suppress, scheduleNext]);

    const fadeOut = suppress;

    return (
      <div
        className="pointer-events-none fixed inset-0 z-[8] overflow-hidden"
        aria-hidden
      >
        <div
          className={`absolute will-change-[left,top,transform,opacity] ${
            fadeOut ? "opacity-0" : "opacity-100"
          } ${fadeOut ? "duration-[900ms] ease-out" : !reduceMotion ? `duration-[700ms]` : ""}`}
          style={
            reduceMotion
              ? {
                  left: "82%",
                  top: "20%",
                  transform: "translate(-50%, -50%)",
                  transition: fadeOut ? "opacity 900ms ease-out" : undefined,
                }
              : {
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: fadeOut
                    ? "translate(-50%, -50%) scale(0.28)"
                    : "translate(-50%, -50%)",
                  transition: fadeOut
                    ? "left 0ms, top 0ms, transform 900ms cubic-bezier(0.4, 0, 0.2, 1), opacity 900ms ease-out"
                    : `left ${TRANSITION_S}s cubic-bezier(0.4, 0, 0.2, 1), top ${TRANSITION_S}s cubic-bezier(0.4, 0, 0.2, 1)`,
                }
          }
        >
          <div
            className={
              reduceMotion
                ? "relative drop-shadow-[0_0_40px_rgba(103,232,249,0.35)]"
                : fadeOut
                  ? "relative drop-shadow-[0_0_40px_rgba(103,232,249,0.35)]"
                  : "astronaut-float-drift relative drop-shadow-[0_0_40px_rgba(103,232,249,0.35)]"
            }
          >
            <div
              ref={ref}
              className="relative h-[min(280px,42vh)] w-[min(220px,38vw)] max-w-[260px]"
            >
              <Image
                src="/assets/astro1.png"
                alt=""
                fill
                sizes="(max-width: 640px) 38vw, 260px"
                className="object-contain object-center"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
