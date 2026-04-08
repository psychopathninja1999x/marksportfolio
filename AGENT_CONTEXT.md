# Portfolio project — context for the next agent

This document summarizes what was built in prior sessions so you can continue without re-reading the full chat.

## Project

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript.
- **Location:** `markportfolio/` (workspace may be `e:\MyPortfolio\markportfolio`).
- **Theme:** Dark “galaxy / constellation” portfolio with a hero (“Hello! I’m **Mark**”) and a **My Works** section.

---

## Entry points

| File | Role |
|------|------|
| `app/page.tsx` | Renders `<HomeExperience />` only. |
| `app/layout.tsx` | Root layout: Geist fonts, global CSS, **fixed galaxy shell** (`.app-galaxy-shell`) behind all pages, children in `relative z-[1]` wrapper. |
| `app/globals.css` | CSS variables, `.galaxy-name-gradient`, `.rotating-role-*`, `.typewriter-cursor`, `.app-galaxy-shell`, `.works-landing` animation. |
| `app/works/page.tsx` | **Client redirect** to `/#works` so old `/works` URLs still work; real content lives on `/` in one scroll. |

---

## Main UX: one page

- Hero + **My Works** are **one document** on `/` (not a separate “feel” for primary navigation).
- **“View My Works”** runs a **launch sequence** on the canvas, then **smooth-scrolls** to `#works` (same URL).
- **`/#works`** deep link: `HomeExperience` scrolls to `#works` on load if the hash is present.

---

## Components (high level)

### `components/HomeExperience.tsx` (client)

- Owns: `launchPhase` state passed to the canvas, `launching` for the button, reduced-motion handling.
- **Launch flow (non–reduced motion):**
  1. `rocket` for `ROCKET_MS` (820ms)
  2. `glide` until `ROCKET_MS + GLIDE_MS` (820 + 1150ms)
  3. `scrollIntoView` on `#works`
  4. After `SCROLL_SETTLE_MS` (900ms): `idle` + `launching` false  
- **Timers:** three separate `setTimeout`s (no nested timer) so UI/canvas always reset.
- **Reduced motion:** immediate `scrollIntoView`, no launch phases.

### `components/ConstellationBackground.tsx` (client)

- **Props:** `launchPhase?: 'idle' \| 'rocket' \| 'glide'`, `position?: 'absolute' \| 'fixed'`.
- **Home** uses `position="fixed"` so **one** starfield stays viewport-locked while scrolling the long page.
- **Physics:**
  - **`idle`:** slow drift + edge bounce; spotlight mesh + cursor-to-star lines (see constants).
  - **`rocket` / `glide`:** downward thrust, wrap/reseed at bottom, motion **trails** (no orange exhaust — removed).
- **After launch ends (`idle` again):** **no instant velocity reset.** A **freeze** runs for `IDLE_FREEZE_FRAMES` (72): strong ease-out damping + slower motion + softer bounces; then velocities reset to normal drift. Spotlight is disabled while `idleFreezeFrames > 0`.
- **Resize:** `idleFreezeFrames` cleared and `lastPhase` reset to avoid stuck state.

**Constants to tune (top of file / nearby):**  
`LINK_DIST`, `SPOTLIGHT_RADIUS`, `CURSOR_LINK_DIST`, `IDLE_FREEZE_FRAMES`.

### `components/RotatingRoles.tsx` (client)

- Typewriter-style rotating lines: “a Mobile App Developer”, “a Web Developer”, etc.
- Reduced motion: static first line, no cursor blink per CSS.

### `components/ViewWorksButton.tsx` (client)

- Presentational: `onLaunch`, `launching`; label shows “Launching…” when busy.

---

## Global visual layer

- **`.app-galaxy-shell`** (in `layout`): fixed CSS gradients aligned with the canvas backdrop so when content **translates** or scroll reveals empty space, it’s not flat black — matches nebula tones.
- **`html`:** `background-color: #030408`; **`body`:** `transparent` so the shell shows through.

---

## Styling notes

- **“Mark”** uses `.galaxy-name-gradient` (animated gradient text).
- **Rotating role** text uses gradient + `.typewriter-cursor`.
- **Works block** uses `.works-landing` (fade / slight motion from above — tuned for single-page arrival).

---

## Known design decisions

1. **No separate full-screen “rocket overlay”** (removed); launch is **canvas-driven** + page scroll.
2. **No red/orange exhaust** under the canvas (intentionally removed).
3. **`/works`** route exists only to **redirect** to `/#works`.
4. **Build:** workspace may warn about multiple `package-lock.json` roots; optional fix: `turbopack.root` in `next.config` or consolidate lockfiles.

---

## Quick file map

```
markportfolio/
  app/
    page.tsx              → HomeExperience
    layout.tsx            → galaxy shell + children wrapper
    globals.css           → themes, animations, .app-galaxy-shell
    works/page.tsx        → redirect to /#works
  components/
    HomeExperience.tsx
    ConstellationBackground.tsx
    RotatingRoles.tsx
    ViewWorksButton.tsx
  AGENT_CONTEXT.md        → this file
```

---

## What to do next (suggestions)

- Replace works placeholder copy with real projects.
- Add a nav bar / back-to-top; ensure `scroll-mt-*` on `#works` works with a sticky header.
- Consider `prefers-reduced-motion` for any new animations.
- Update `layout.tsx` `metadata` (title/description) from Create Next App defaults.

---

*Generated as a handoff summary; extend this file as the project grows.*
