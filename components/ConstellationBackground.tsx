"use client";

import { useEffect, useRef } from "react";

export type LaunchPhase = "idle" | "rocket" | "glide";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Stellar color variety: hot blue-white, sun-like, cool red */
  kind: "cool" | "warm" | "red";
  r: number;
};

/** Max distance between two stars to allow a connecting edge (mesh topology). */
const LINK_DIST = 130;
/** Lines only appear when the cursor is within this distance of the segment (flashlight). */
const SPOTLIGHT_RADIUS = 260;
/** Cursor connects to stars within this radius. */
const CURSOR_LINK_DIST = 200;
/** Frames of eased damping after launch — “time freezing” before calm drift */
const IDLE_FREEZE_FRAMES = 72;

function drawGalaxyBackdrop(
  g: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  const cx = w * 0.38;
  const cy = h * 0.22;
  const r = Math.hypot(w, h) * 0.58;
  const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r);
  grad.addColorStop(0, "#2d2d5c");
  grad.addColorStop(0.22, "#18182f");
  grad.addColorStop(0.48, "#0c1022");
  grad.addColorStop(1, "#030408");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  g.save();
  g.globalAlpha = 0.35;
  const g2 = g.createRadialGradient(
    w * 0.78,
    h * 0.72,
    0,
    w * 0.78,
    h * 0.72,
    Math.hypot(w, h) * 0.45
  );
  g2.addColorStop(0, "rgba(90, 50, 120, 0.55)");
  g2.addColorStop(0.55, "rgba(30, 20, 50, 0.15)");
  g2.addColorStop(1, "rgba(0, 0, 0, 0)");
  g.fillStyle = g2;
  g.fillRect(0, 0, w, h);
  g.restore();

  g.save();
  g.globalAlpha = 0.2;
  const g3 = g.createLinearGradient(0, 0, w, h);
  g3.addColorStop(0, "rgba(20, 60, 90, 0.4)");
  g3.addColorStop(1, "rgba(0, 0, 0, 0)");
  g.fillStyle = g3;
  g.fillRect(0, 0, w, h);
  g.restore();
}

function starStyle(kind: Particle["kind"]): string {
  switch (kind) {
    case "warm":
      return "rgba(255, 236, 210, 0.88)";
    case "red":
      return "rgba(255, 160, 150, 0.82)";
    default:
      return "rgba(210, 228, 255, 0.9)";
  }
}

type ConstellationBackgroundProps = {
  launchPhase?: LaunchPhase;
  /** `fixed` = one layer for full-page scroll; `absolute` = inside a positioned parent */
  position?: "absolute" | "fixed";
};

export function ConstellationBackground({
  launchPhase = "idle",
  position = "absolute",
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const phaseRef = useRef<LaunchPhase>(launchPhase);
  phaseRef.current = launchPhase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx;
    const surface = canvas;

    const particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let lastPhase: LaunchPhase = "idle";
    let idleFreezeFrames = 0;

    function pickKind(): Particle["kind"] {
      const u = Math.random();
      if (u < 0.55) return "cool";
      if (u < 0.88) return "warm";
      return "red";
    }

    function initParticles() {
      particles.length = 0;
      const area = w * h;
      const count = Math.min(200, Math.max(85, Math.floor(area / 6500)));
      for (let i = 0; i < count; i++) {
        const kind = pickKind();
        const r =
          kind === "red"
            ? 1.6 + Math.random() * 0.9
            : kind === "warm"
              ? 1.1 + Math.random() * 0.5
              : 1.2 + Math.random() * 0.7;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          kind,
          r,
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      surface.width = w * dpr;
      surface.height = h * dpr;
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
      idleFreezeFrames = 0;
      lastPhase = "idle";
    }

    function dist(
      ax: number,
      ay: number,
      bx: number,
      by: number
    ): number {
      return Math.hypot(ax - bx, ay - by);
    }

    function distPointToSegment(
      px: number,
      py: number,
      ax: number,
      ay: number,
      bx: number,
      by: number
    ): number {
      const abx = bx - ax;
      const aby = by - ay;
      const apx = px - ax;
      const apy = py - ay;
      const abLenSq = abx * abx + aby * aby;
      if (abLenSq < 1e-10) return Math.hypot(apx, apy);
      let t = (apx * abx + apy * aby) / abLenSq;
      t = Math.max(0, Math.min(1, t));
      const cx = ax + t * abx;
      const cy = ay + t * aby;
      return Math.hypot(px - cx, py - cy);
    }

    function step() {
      const phase = phaseRef.current;

      if (phase === "idle" && lastPhase !== "idle") {
        idleFreezeFrames = IDLE_FREEZE_FRAMES;
        for (const p of particles) {
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        }
      }

      const freezing = phase === "idle" && idleFreezeFrames > 0;

      drawGalaxyBackdrop(g, w, h);

      for (const p of particles) {
        if (phase !== "idle") {
          p.vx *= 0.965;
          const thrust = phase === "rocket" ? 0.52 : 0.38;
          p.vy += thrust;
          const maxVy = phase === "rocket" ? 26 : 22;
          if (p.vy > maxVy) p.vy = maxVy;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y > h + 40) {
            p.y = -30 - Math.random() * h * 0.4;
            p.x = Math.random() * w;
            p.vy = 5 + Math.random() * 6;
            p.vx = (Math.random() - 0.5) * 3;
          }
        } else if (freezing) {
          const ease = idleFreezeFrames / IDLE_FREEZE_FRAMES;
          const damp = 0.82 + 0.1 * ease;
          p.vx *= damp;
          p.vy *= damp;
          p.x += p.vx * 0.65;
          p.y += p.vy * 0.65;
          if (p.x < 0 || p.x > w) p.vx *= -0.45;
          if (p.y < 0 || p.y > h) p.vy *= -0.45;
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        }
      }

      if (freezing) {
        idleFreezeFrames -= 1;
        if (idleFreezeFrames === 0) {
          for (const p of particles) {
            p.vx = (Math.random() - 0.5) * 0.28;
            p.vy = (Math.random() - 0.5) * 0.28;
          }
        }
      }

      if (phase !== "idle") {
        g.save();
        for (const p of particles) {
          const tail = phase === "rocket" ? 5.5 : 4.2;
          const ax = p.x - p.vx * tail;
          const ay = p.y - p.vy * tail;
          const speed = Math.hypot(p.vx, p.vy);
          const a = Math.min(0.45, 0.08 + speed * 0.018);
          g.strokeStyle = `rgba(180, 220, 255, ${a})`;
          g.lineWidth = 1.2;
          g.beginPath();
          g.moveTo(ax, ay);
          g.lineTo(p.x, p.y);
          g.stroke();
        }
        g.restore();
      }

      const { x: mx, y: my, inside } = mouseRef.current;
      if (inside && phase === "idle" && !freezing) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const edgeLen = dist(a.x, a.y, b.x, b.y);
            if (edgeLen >= LINK_DIST) continue;

            const dSpot = distPointToSegment(mx, my, a.x, a.y, b.x, b.y);
            if (dSpot >= SPOTLIGHT_RADIUS) continue;

            const falloffEdge = 1 - edgeLen / LINK_DIST;
            const falloffLight = 1 - dSpot / SPOTLIGHT_RADIUS;
            const alpha =
              falloffEdge * Math.pow(falloffLight, 1.15) * 0.42;
            g.strokeStyle = `rgba(170, 205, 255, ${alpha})`;
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }

        for (const p of particles) {
          const d = dist(mx, my, p.x, p.y);
          if (d < CURSOR_LINK_DIST) {
            const t = 1 - d / CURSOR_LINK_DIST;
            g.strokeStyle = `rgba(210, 230, 255, ${t * 0.5})`;
            g.lineWidth = 1.1;
            g.beginPath();
            g.moveTo(mx, my);
            g.lineTo(p.x, p.y);
            g.stroke();
          }
        }
      }

      for (const p of particles) {
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fillStyle = starStyle(p.kind);
        g.fill();
      }

      lastPhase = phase;
      raf = requestAnimationFrame(step);
    }

    function onMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.inside = true;
    }

    function onLeave() {
      mouseRef.current.inside = false;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const posClass =
    position === "fixed"
      ? "pointer-events-none fixed inset-0 z-0 h-full w-full"
      : "pointer-events-none absolute inset-0 z-0 h-full w-full";

  return <canvas ref={canvasRef} className={posClass} aria-hidden />;
}
