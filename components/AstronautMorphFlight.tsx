"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type AstronautMorphFlightProps = {
  start: Rect;
  end: Rect;
  onComplete: () => void;
  /** Destination still (default: About astro2) */
  endImageSrc?: string;
};

/** Smooth decel — only `transform` is animated (GPU), not layout props. */
const EASE = "cubic-bezier(0.22, 1, 0.32, 1)";
const DURATION_MS = 1180;
/** Crossfade astro1 → astro2 over the tail of the flight */
const CROSSFADE_MS = 420;

/**
 * FLIP morph: starts as **astro1** (matches floater), then crossfades to **endImage**
 * while the transform finishes so the section can show the final still seamlessly.
 */
export function AstronautMorphFlight({
  start,
  end,
  onComplete,
  endImageSrc = "/assets/astro2.png",
}: AstronautMorphFlightProps) {
  const [playing, setPlaying] = useState(false);
  const [blendToEnd, setBlendToEnd] = useState(false);
  const doneRef = useRef(false);

  const sx = end.width > 0.5 ? start.width / end.width : 1;
  const sy = end.height > 0.5 ? start.height / end.height : 1;
  const tx = start.left - end.left;
  const ty = start.top - end.top;

  const invert = `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`;
  const identity = "translate3d(0px, 0px, 0) scale(1, 1)";

  useLayoutEffect(() => {
    setPlaying(false);
    setBlendToEnd(false);
    doneRef.current = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPlaying(true));
    });
    return () => cancelAnimationFrame(id);
  }, [start, end, endImageSrc]);

  useEffect(() => {
    if (!playing) return;
    const tid = window.setTimeout(
      () => setBlendToEnd(true),
      Math.max(0, DURATION_MS - CROSSFADE_MS)
    );
    return () => clearTimeout(tid);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    }, DURATION_MS + 80);
    return () => clearTimeout(t);
  }, [playing, onComplete]);

  const imgFilter =
    "drop-shadow(0 0 24px rgba(103, 232, 249, 0.28))";

  return (
    <div
      className="pointer-events-none fixed z-[30]"
      style={{
        left: end.left,
        top: end.top,
        width: end.width,
        height: end.height,
        transformOrigin: "0 0",
        transform: playing ? identity : invert,
        transition: playing
          ? `transform ${DURATION_MS}ms ${EASE}`
          : "none",
        willChange: playing ? "transform" : "auto",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName !== "transform" || doneRef.current) return;
        doneRef.current = true;
        onComplete();
      }}
    >
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- flight morph layer */}
        <img
          src="/assets/astro1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center"
          style={{
            opacity: blendToEnd ? 0 : 1,
            transition: `opacity ${CROSSFADE_MS}ms ${EASE}`,
            filter: imgFilter,
          }}
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- flight morph layer */}
        <img
          src={endImageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center"
          style={{
            opacity: blendToEnd ? 1 : 0,
            transition: `opacity ${CROSSFADE_MS}ms ${EASE}`,
            filter: imgFilter,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
