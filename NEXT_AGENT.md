# Handoff for the next agent — `markportfolio`

Single-page portfolio: dark galaxy theme, constellation canvas, astronaut imagery, hero → About → Works. **Read this before changing UX or animation.**

---

## Stack & location

| Item | Value |
|------|--------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (`app/globals.css`, `@import "tailwindcss"`) |
| Icons | `react-icons` (Simple Icons, Tabler, Font Awesome **`fa`**, Devicons as needed) |
| Path | `markportfolio/` (workspace may be `e:\MyPortfolio\markportfolio`) |

**Dependency note:** Import icons from `react-icons/fa` (not `fa6`) for Java — Turbopack has had runtime “module factory not available” issues with `fa6` chunks.

---

## Entry points

| File | Role |
|------|------|
| `app/page.tsx` | Renders `<HomeExperience />` only. |
| `app/layout.tsx` | Geist fonts, `globals.css`, fixed **`.app-galaxy-shell`** behind content, children `relative z-[1]`. |
| `app/globals.css` | Variables, galaxy text, constellation-related animations, About morph/levitate/copy-reveal, works landing. |
| `app/works/page.tsx` | Client redirect to `/#works` (bookmarks). |
| `app/works/[slug]/page.tsx` | Per-project case study (`ProjectDetailExperience`); data from `lib/projects.ts`. |
| `lib/projects.ts` | `PROJECTS` array + `getProjectBySlug`. |

---

## Page sections (one scroll on `/`)

1. **Hero** — “Hello! I’m **Mark**”, `RotatingRoles`, primary CTA **`ViewWorksButton`**: label **“Launch”** (not “View My Works”); runs canvas launch then scrolls to **`#about`** (About Me), not Works.
2. **About (`#about`)** — Copy (Who am I?, bio paragraphs), **Technologies** grid (`AboutTechStack`), **astro2** image with levitation. **No** contact/name/age/email block (removed).
3. **Works (`#works`)** — Project grid from `PROJECTS` (`ProjectPreviewCard` → `/works/[slug]`). Empty: `WorksEmptySlots` placeholders.

**Deep links:** `/#about` and `/#works` — `HomeExperience` scrolls on load if `location.hash` matches.

**Down-arrow** (round button) at bottom of **About** only: launches to **`#works`** (same timing as hero → about).

---

## Launch & canvas

- **`ConstellationBackground`** — `launchPhase`: `idle` | `rocket` | `glide`. Fixed on home so stars stay behind scroll.
- **Timing constants** (in `HomeExperience.tsx`): `ROCKET_MS` 820, `GLIDE_MS` 1150, `SCROLL_SETTLE_MS` 900; three independent `setTimeout`s, then `scrollIntoView` on target section.
- **`runLaunchToSection('about' | 'works')`** — Hero **Launch** → `#about`; About **↓** → `#works`.
- **`prefers-reduced-motion`:** skip rocket/glide; immediate `scrollIntoView`.

---

## Astronaut visuals

| Asset | Use |
|-------|-----|
| `public/assets/astro1.png` | **FloatingAstronaut** — small random drift + wobble; hidden when About is in view or during FLIP. |
| `public/assets/astro2.png` | **About** section large image (`next/image`), **levitation** (`.about-astro-levitate` in `globals.css`). |

**Morph (About enter):**

- **IntersectionObserver** on `#about` (~14% visible). On **enter**: measure **floater** `getBoundingClientRect()` (`floaterMountRef`) and **slot** `aboutAstroMountRef` (outer wrapper **without** transform — important for correct end rect).
- **`AstronautMorphFlight`:** GPU **transform-only** FLIP (`translate3d` + `scale`), **not** animating `left/top/width/height`.
- Flight layer: **astro1** visible first, then **opacity crossfade** to **astro2** in the last ~420ms (`CROSSFADE_MS` in `AstronautMorphFlight.tsx`).
- On complete: clear `flight`, set `morphLanded`, show static About image.
- **Fallback:** if rects invalid → CSS `.about-astro-morph--visible` keyframe morph.
- **Reduced motion:** no flight overlay; About content shows normally.

**FloatingAstronaut:** `forwardRef` on the image wrapper for measurement; `suppress={aboutInView || !!flight}`.

---

## About copy & tech stack

- Copy lives in **`HomeExperience.tsx`** (intro, three paragraphs). Tune wording there.
- **`AboutTechStack.tsx`** — grid of tech chips with `react-icons`. **Java** uses `FaJava` from **`react-icons/fa`**. List includes Yii2, React, React Native, Laravel, TS, Next, Tailwind, NativeWind, Flutter, Dart, Kotlin, Java, C++, VBA, VB.NET, etc. Add/remove entries in the `TECH` array.

---

## CSS highlights (`globals.css`)

- **`.galaxy-name-gradient`** — animated gradient on highlighted names.
- **`.about-astro-morph`**, **`--visible`**, **`--landed`** — About image entrance / post-FLIP.
- **`.about-astro-levitate`** — slow floating motion on astro2; disabled under `prefers-reduced-motion`.
- **`.about-copy-reveal`** + **`--visible`** — staggered rise for About blocks (nth-child 1–3).
- **`.works-landing`** — Works section entrance.
- **`.astronaut-float-drift`** — small floater wobble.

---

## Components (quick map)

| File | Purpose |
|------|---------|
| `HomeExperience.tsx` | Orchestrates sections, launch, intersection, morph state, refs. |
| `ConstellationBackground.tsx` | Canvas starfield + launch physics; tune `LINK_DIST`, `SPOTLIGHT_*`, `IDLE_FREEZE_FRAMES`. |
| `FloatingAstronaut.tsx` | `forwardRef`; astro1 floater; `suppress` prop. |
| `AstronautMorphFlight.tsx` | FLIP + astro1→astro2 crossfade. |
| `AboutTechStack.tsx` | Technology grid + icons. |
| `ViewWorksButton.tsx` | “Launch” CTA (idle / launching). |
| `RotatingRoles.tsx` | Rotating subtitle lines. |
| `ProjectPreviewCard.tsx` | Home `#works` tiles linking to `/works/[slug]`. |
| `ProjectDetailExperience.tsx` | Full project page; back link to `/#works`. |
| `WorksEmptySlots.tsx` | Placeholders when `PROJECTS` is empty. |

---

## Known issues / ops

- **Multiple `package-lock.json` roots** may make Next warn about workspace root; optional: `turbopack.root` in `next.config` or consolidate lockfiles.
- **`layout.tsx` metadata** may still be Create Next App defaults — update title/description for production.

---

## Older summary

`AGENT_CONTEXT.md` exists but predates astronaut morph, About rewrite, and tech grid. **This file (`NEXT_AGENT.md`) is the preferred up-to-date handoff** — extend it when you ship meaningful changes.
