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

/** Rotating quips near the helmet — keep aria-hidden parent; decorative only. */
const HIRE_ME_QUIPS = [
  "Hire me! Suit included, ego low orbit.",
  "Open to full-time… and low Earth orbit.",
  "Will debug for rocket fuel (and a paycheck).",
  "References available — they’re all weightless.",
  "Pick me: I already passed the vibe check at NASA.",
  "Looking for a mission. Preferably with snacks.",
  "Hire me before this helmet fogs up.",
  "Zero-gravity experience. Stack overflow gravity: high.",
  "Available now. Onboarding at warp speed.",
  "Will ship features. May wave dramatically.",
  "My standups are short. My commits are shorter.",
  "Contract? Full-time? I’m flexible — unlike this suit.",
];

/** Time between end of one bubble and start of the next. */
const BUBBLE_GAP_MS = 10_000;
const TYPEWRITER_MS_PER_CHAR = 42;
const BUBBLE_HOLD_AFTER_TYPING_MS = 2800;

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickNextMessageIndex(prev: number) {
  if (HIRE_ME_QUIPS.length < 2) return 0;
  let next = prev;
  while (next === prev) {
    next = Math.floor(Math.random() * HIRE_ME_QUIPS.length);
  }
  return next;
}

export type FloatingAstronautProps = {
  /** Hide floater while About is primary or during FLIP flight */
  suppress?: boolean;
};

export const FloatingAstronaut = forwardRef<HTMLDivElement, FloatingAstronautProps>(
  function FloatingAstronaut({ suppress = false }, ref) {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [pos, setPos] = useState({ x: 22, y: 28 });
    /** Index is only meaningful while a round is active; start at 0 for SSR. */
    const [bubbleIndex, setBubbleIndex] = useState(0);
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [typedLength, setTypedLength] = useState(0);
    const timerRef = useRef<number | null>(null);
    const gapTimerRef = useRef<number | null>(null);
    const typeStepTimerRef = useRef<number | null>(null);
    const holdTimerRef = useRef<number | null>(null);
    const suppressRef = useRef(suppress);
    suppressRef.current = suppress;

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

    const clearBubbleTimers = useCallback(() => {
      if (gapTimerRef.current !== null) {
        clearTimeout(gapTimerRef.current);
        gapTimerRef.current = null;
      }
      if (typeStepTimerRef.current !== null) {
        clearTimeout(typeStepTimerRef.current);
        typeStepTimerRef.current = null;
      }
      if (holdTimerRef.current !== null) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    }, []);

    const queueNextBubble = useCallback(() => {
      if (suppressRef.current) return;
      if (gapTimerRef.current !== null) clearTimeout(gapTimerRef.current);
      gapTimerRef.current = window.setTimeout(() => {
        gapTimerRef.current = null;
        if (suppressRef.current) return;
        setBubbleIndex((i) => pickNextMessageIndex(i));
        setBubbleVisible(true);
      }, BUBBLE_GAP_MS);
    }, []);

    useEffect(() => {
      if (suppress) {
        clearBubbleTimers();
        setBubbleVisible(false);
        setTypedLength(0);
        return;
      }
      setBubbleVisible(false);
      setTypedLength(0);
      clearBubbleTimers();
      queueNextBubble();
      return () => {
        clearBubbleTimers();
      };
    }, [suppress, clearBubbleTimers, queueNextBubble]);

    const fullBubbleText = HIRE_ME_QUIPS[bubbleIndex];

    useEffect(() => {
      if (!bubbleVisible || suppress) {
        setTypedLength(0);
        return;
      }

      if (reduceMotion) {
        setTypedLength(fullBubbleText.length);
        if (holdTimerRef.current !== null) clearTimeout(holdTimerRef.current);
        holdTimerRef.current = window.setTimeout(() => {
          holdTimerRef.current = null;
          if (suppressRef.current) return;
          setBubbleVisible(false);
          setTypedLength(0);
          queueNextBubble();
        }, BUBBLE_HOLD_AFTER_TYPING_MS);
        return () => {
          if (holdTimerRef.current !== null) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
          }
        };
      }

      setTypedLength(0);
      let i = 0;

      const step = () => {
        if (suppressRef.current) return;
        i += 1;
        setTypedLength(i);
        if (i < fullBubbleText.length) {
          typeStepTimerRef.current = window.setTimeout(
            step,
            TYPEWRITER_MS_PER_CHAR
          );
        } else {
          typeStepTimerRef.current = null;
          holdTimerRef.current = window.setTimeout(() => {
            holdTimerRef.current = null;
            if (suppressRef.current) return;
            setBubbleVisible(false);
            setTypedLength(0);
            queueNextBubble();
          }, BUBBLE_HOLD_AFTER_TYPING_MS);
        }
      };

      typeStepTimerRef.current = window.setTimeout(step, TYPEWRITER_MS_PER_CHAR);

      return () => {
        if (typeStepTimerRef.current !== null) {
          clearTimeout(typeStepTimerRef.current);
          typeStepTimerRef.current = null;
        }
        if (holdTimerRef.current !== null) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
      };
    }, [bubbleVisible, bubbleIndex, fullBubbleText, suppress, reduceMotion, queueNextBubble]);

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
            <div className="relative">
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
              <div
                className={`absolute left-1/2 top-0 z-10 w-max max-w-[min(200px,52vw)] -translate-x-1/2 -translate-y-[calc(100%+0.65rem)] sm:max-w-[220px] ${
                  reduceMotion ? "" : "transition-opacity duration-700 ease-out"
                } ${
                  fadeOut || !bubbleVisible
                    ? "pointer-events-none opacity-0"
                    : "opacity-100"
                }`}
                aria-hidden
              >
                <div className="relative rounded-2xl border border-cyan-400/35 bg-[#0d1117]/92 px-3 py-2 text-center shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-sm">
                  <p className="min-h-[2.75rem] font-mono text-[10px] font-medium leading-snug tracking-wide text-[#e8eaef] sm:min-h-[3rem] sm:text-[11px]">
                    {fullBubbleText.slice(0, typedLength)}
                    {bubbleVisible &&
                    typedLength < fullBubbleText.length &&
                    !reduceMotion ? (
                      <span
                        className="ml-px inline-block h-[0.95em] w-px translate-y-px animate-pulse bg-cyan-300/90 align-text-bottom"
                        aria-hidden
                      />
                    ) : null}
                  </p>
                  <div
                    className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-cyan-400/35 bg-[#0d1117]/92"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
