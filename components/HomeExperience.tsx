"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConstellationBackground,
  type LaunchPhase,
} from "@/components/ConstellationBackground";
import { AboutTechStack } from "@/components/AboutTechStack";
import {
  AstronautMorphFlight,
  type Rect,
} from "@/components/AstronautMorphFlight";
import { FloatingAstronaut } from "@/components/FloatingAstronaut";
import { RotatingRoles } from "@/components/RotatingRoles";
import { ContactOutreach } from "@/components/ContactOutreach";
import { ProjectPreviewCard } from "@/components/ProjectPreviewCard";
import { ViewWorksButton } from "@/components/ViewWorksButton";
import { WorksEmptySlots } from "@/components/WorksEmptySlots";
import {
  getFeaturedProjects,
  getRestProjects,
  PROJECTS,
} from "@/lib/projects";

const ROCKET_MS = 820;
const GLIDE_MS = 1150;
const SCROLL_SETTLE_MS = 900;

export function HomeExperience() {
  const [launchPhase, setLaunchPhase] = useState<LaunchPhase>("idle");
  const [restProjectsOpen, setRestProjectsOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);
  const [flight, setFlight] = useState<{ start: Rect; end: Rect } | null>(null);
  const [useCssMorphFallback, setUseCssMorphFallback] = useState(false);
  const [morphLanded, setMorphLanded] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const [contactFlight, setContactFlight] = useState<{
    start: Rect;
    end: Rect;
  } | null>(null);
  const [contactUseCssFallback, setContactUseCssFallback] = useState(false);
  const [contactMorphLanded, setContactMorphLanded] = useState(false);
  const timersRef = useRef<number[]>([]);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const contactSectionRef = useRef<HTMLElement | null>(null);
  const floaterMountRef = useRef<HTMLDivElement | null>(null);
  const aboutAstroMountRef = useRef<HTMLDivElement | null>(null);
  const contactAstroMountRef = useRef<HTMLDivElement | null>(null);
  const prevAboutInViewRef = useRef(false);
  const prevContactInViewRef = useRef(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
    },
    []
  );

  useEffect(() => {
    const el = aboutSectionRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        const inView = e.intersectionRatio > 0.14;
        const wasInView = prevAboutInViewRef.current;

        if (inView && !wasInView) {
          if (reduceMotionRef.current) {
            setFlight(null);
            setUseCssMorphFallback(false);
            setMorphLanded(true);
          } else {
            const a = floaterMountRef.current?.getBoundingClientRect();
            const b = aboutAstroMountRef.current?.getBoundingClientRect();
            if (
              a &&
              b &&
              a.width > 4 &&
              a.height > 4 &&
              b.width > 4 &&
              b.height > 4
            ) {
              setFlight({
                start: {
                  left: a.left,
                  top: a.top,
                  width: a.width,
                  height: a.height,
                },
                end: {
                  left: b.left,
                  top: b.top,
                  width: b.width,
                  height: b.height,
                },
              });
              setUseCssMorphFallback(false);
              setMorphLanded(false);
            } else {
              setFlight(null);
              setUseCssMorphFallback(true);
              setMorphLanded(false);
            }
          }
        }

        if (!inView && wasInView) {
          setFlight(null);
          setMorphLanded(false);
          setUseCssMorphFallback(false);
        }

        prevAboutInViewRef.current = inView;
        setAboutInView(inView);
      },
      { threshold: [0, 0.06, 0.14, 0.3, 0.55, 1] }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    const el = contactSectionRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        const inView = e.intersectionRatio > 0.14;
        const wasInView = prevContactInViewRef.current;

        if (inView && !wasInView) {
          if (reduceMotionRef.current) {
            setContactFlight(null);
            setContactUseCssFallback(false);
            setContactMorphLanded(true);
          } else {
            const a = floaterMountRef.current?.getBoundingClientRect();
            const b = contactAstroMountRef.current?.getBoundingClientRect();
            if (
              a &&
              b &&
              a.width > 4 &&
              a.height > 4 &&
              b.width > 4 &&
              b.height > 4
            ) {
              setContactFlight({
                start: {
                  left: a.left,
                  top: a.top,
                  width: a.width,
                  height: a.height,
                },
                end: {
                  left: b.left,
                  top: b.top,
                  width: b.width,
                  height: b.height,
                },
              });
              setContactUseCssFallback(false);
              setContactMorphLanded(false);
            } else {
              setContactFlight(null);
              setContactUseCssFallback(true);
              setContactMorphLanded(false);
            }
          }
        }

        if (!inView && wasInView) {
          setContactFlight(null);
          setContactMorphLanded(false);
          setContactUseCssFallback(false);
        }

        prevContactInViewRef.current = inView;
        setContactInView(inView);
      },
      { threshold: [0, 0.06, 0.14, 0.3, 0.55, 1] }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const handleFlightComplete = useCallback(() => {
    setFlight(null);
    setMorphLanded(true);
  }, []);

  const handleContactFlightComplete = useCallback(() => {
    setContactFlight(null);
    setContactMorphLanded(true);
  }, []);

  const copyRevealed =
    aboutInView &&
    !flight &&
    (morphLanded || useCssMorphFallback || reduceMotion);

  const contactCopyRevealed =
    contactInView &&
    !contactFlight &&
    (contactMorphLanded || contactUseCssFallback || reduceMotion);

  const scrollToSection = useCallback((sectionId: "about" | "works" | "contact") => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash !== "#works" && hash !== "#about" && hash !== "#contact") return;
    const id =
      hash === "#about" ? "about" : hash === "#contact" ? "contact" : "works";
    const t = window.setTimeout(() => scrollToSection(id), 80);
    return () => window.clearTimeout(t);
  }, [scrollToSection]);

  const runLaunchToSection = useCallback(
    (sectionId: "about" | "works" | "contact") => {
      if (launching) return;
      if (reduceMotion) {
        scrollToSection(sectionId);
        return;
      }
      setLaunching(true);
      setLaunchPhase("rocket");
      timersRef.current.forEach(clearTimeout);

      const glideAt = ROCKET_MS;
      const scrollAt = ROCKET_MS + GLIDE_MS;
      const idleAt = scrollAt + SCROLL_SETTLE_MS;

      timersRef.current = [
        window.setTimeout(() => {
          setLaunchPhase("glide");
        }, glideAt),
        window.setTimeout(() => {
          scrollToSection(sectionId);
        }, scrollAt),
        window.setTimeout(() => {
          setLaunchPhase("idle");
          setLaunching(false);
        }, idleAt),
      ];
    },
    [launching, reduceMotion, scrollToSection]
  );

  const handleLaunchToAbout = useCallback(() => {
    runLaunchToSection("about");
  }, [runLaunchToSection]);

  const handleLaunchToWorks = useCallback(() => {
    runLaunchToSection("works");
  }, [runLaunchToSection]);

  const handleLaunchToContact = useCallback(() => {
    runLaunchToSection("contact");
  }, [runLaunchToSection]);

  return (
    <div className="relative w-full overflow-x-hidden bg-transparent">
      <ConstellationBackground
        launchPhase={launchPhase}
        position="fixed"
      />
      <FloatingAstronaut
        ref={floaterMountRef}
        suppress={
          aboutInView || !!flight || contactInView || !!contactFlight
        }
      />
      {flight ? (
        <AstronautMorphFlight
          start={flight.start}
          end={flight.end}
          onComplete={handleFlightComplete}
        />
      ) : null}
      {contactFlight ? (
        <AstronautMorphFlight
          start={contactFlight.start}
          end={contactFlight.end}
          endImageSrc="/assets/astro3.png"
          onComplete={handleContactFlightComplete}
        />
      ) : null}

      <section
        className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6"
        aria-label="Introduction"
      >
        <div className="flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-4xl font-medium tracking-tight text-[#e8eaef] sm:text-5xl md:text-6xl">
            Hello! I&apos;m{" "}
            <span className="galaxy-name-gradient font-semibold">Mark</span>
            .
          </h1>
          <RotatingRoles />
          <ViewWorksButton onLaunch={handleLaunchToAbout} launching={launching} />
        </div>
      </section>

      <section
        ref={aboutSectionRef}
        id="about"
        className="relative z-10 flex min-h-[100dvh] w-full scroll-mt-6 flex-col items-center justify-center px-6 py-16 md:py-20"
        aria-labelledby="about-heading"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-12 lg:gap-16">
          <div
            ref={aboutAstroMountRef}
            className="relative mx-auto aspect-[3/4] w-[min(100%,300px)] shrink-0 sm:w-[min(100%,360px)] md:h-[min(76vh,600px)] md:w-[min(460px,48vw)] md:max-w-[480px]"
          >
            <div
              className={`about-astro-morph h-full w-full ${
                flight ? "invisible" : ""
              } ${
                !flight && aboutInView && morphLanded
                  ? "about-astro-morph--landed"
                  : ""
              } ${
                !flight &&
                aboutInView &&
                !morphLanded &&
                useCssMorphFallback
                  ? "about-astro-morph--visible"
                  : ""
              }`}
            >
              <div className="about-astro-levitate relative h-full min-h-[200px] w-full">
                <Image
                  src="/assets/astro2.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) min(360px, 100vw), 480px"
                  className="object-contain object-center drop-shadow-[0_0_48px_rgba(103,232,249,0.28)]"
                  priority={false}
                />
              </div>
            </div>
          </div>

          <div
            className={`w-full max-w-xl text-left md:max-w-xl lg:max-w-2xl ${
              copyRevealed ? "about-copy-reveal--visible" : ""
            }`}
          >
            <div className="about-copy-reveal">
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan-400/70">
                INTRODUCTION
              </p>
              <h2
                id="about-heading"
                className="text-3xl font-semibold tracking-tight text-[#e8eaef] sm:text-4xl"
              >
                <span className="text-cyan-200/95">ABOUT ME</span>
              </h2>
            </div>

            <div className="about-copy-reveal mt-8 space-y-5 text-pretty">
              <p className="text-base font-semibold leading-relaxed text-[#e8eaef] md:text-lg">
                I&apos;m{" "}
                <span className="galaxy-name-gradient font-semibold">
                  Mark Vincent Faith Item
                </span>
                , a Software Developer focused on building impactful digital
                solutions—from software design and web applications to mobile
                development and beyond.
              </p>
              <p className="text-[0.95rem] leading-relaxed text-[#94a3b8] md:text-base">
                I am a 26-year-old developer based in Zamboanga City with a strong
                passion for creating efficient, user-centered, and scalable
                applications. My experience spans across multiple technologies,
                allowing me to adapt and deliver solutions across different
                platforms and use cases.
              </p>
              <p className="text-[0.95rem] leading-relaxed text-[#94a3b8] md:text-base">
                I enjoy turning ideas into functional products, continuously
                learning new technologies, and taking on challenges that push my
                skills further. Whether it&apos;s developing applications,
                optimizing systems, or exploring emerging tools, I am driven to
                create meaningful and high-quality digital experiences.
              </p>
            </div>

            <div className="about-copy-reveal mt-10 border-t border-white/[0.12] pt-8">
              <h3 className="text-sm font-semibold tracking-wide text-rose-300/90">
                Technologies I have worked with:
              </h3>
              <AboutTechStack />
            </div>

            <div className="about-copy-reveal mt-10 border-t border-white/[0.12] pt-8">
              <dl className="grid grid-cols-1 gap-6 text-sm text-[#94a3b8] sm:grid-cols-2 sm:gap-x-10">
                <div className="space-y-4">
                  <div>
                  
                   
                  </div>
                  <div>
                  
                    
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                   
                    <dd className="mt-1.5">
                     
                    </dd>
                  </div>
                  <div>
                   
                  
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLaunchToWorks}
          disabled={launching}
          aria-busy={launching}
          aria-label="Launch down to My Works"
          className="absolute bottom-10 left-0 right-0 z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/25 bg-gradient-to-b from-white/[0.07] to-white/[0.02] text-cyan-300/90 shadow-[0_0_24px_rgba(103,232,249,0.1)] transition-all duration-300 hover:border-cyan-300/45 hover:translate-y-0.5 hover:text-cyan-200 hover:shadow-[0_0_36px_rgba(103,232,249,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </section>

      <section
        id="works"
        className="relative z-10 flex min-h-[100dvh] w-full scroll-mt-6 flex-col items-center px-6 py-20 pb-28"
        aria-labelledby="works-heading"
      >
        <div className="works-landing flex w-full max-w-6xl flex-col items-center">
          <div className="max-w-4xl text-center">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan-400/70">
              PORTFOLIO
            </p>
            <h2
              id="works-heading"
              className="text-4xl font-medium tracking-tight text-[#e8eaef] sm:text-5xl md:text-6xl"
            >
              <span className="galaxy-name-gradient font-semibold">My Works</span>
            </h2>
            <p className="mt-6 max-w-lg text-pretty text-base text-[#94a3b8] md:text-lg">
              Everything lives on this page — open a project for the full case
              study on its own route.
            </p>
          </div>

          {PROJECTS.length > 0 ? (
            <>
              <div className="mt-14 grid w-full gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {getFeaturedProjects().map((p) => (
                  <ProjectPreviewCard key={p.slug} project={p} />
                ))}
              </div>
              {getRestProjects().length > 0 ? (
                <div className="mt-12 flex w-full flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setRestProjectsOpen((o) => !o)}
                    aria-expanded={restProjectsOpen}
                    aria-controls="rest-of-projects-panel"
                    id="rest-of-projects-toggle"
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-6 py-3 text-sm font-semibold tracking-wide text-cyan-100 shadow-[0_0_24px_rgba(103,232,249,0.12)] transition hover:border-cyan-300/50 hover:shadow-[0_0_32px_rgba(103,232,249,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60"
                  >
                    {restProjectsOpen ? (
                      <>
                        Hide additional projects
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path d="M18 15l-6-6-6 6" />
                        </svg>
                      </>
                    ) : (
                      <>
                        More projects
                        <span className="font-mono text-xs text-cyan-400/80">
                          ({getRestProjects().length})
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </>
                    )}
                  </button>

                  {restProjectsOpen ? (
                    <div
                      id="rest-of-projects-panel"
                      role="region"
                      aria-labelledby="more-works-heading"
                      className="mt-14 w-full border-t border-white/[0.1] pt-14"
                    >
                      <h3
                        className="mb-10 text-center font-mono text-xs tracking-[0.2em] text-cyan-400/75"
                        id="more-works-heading"
                      >
                        REST OF THE PROJECTS
                      </h3>
                      <div className="grid w-full gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {getRestProjects().map((p) => (
                          <ProjectPreviewCard key={p.slug} project={p} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <WorksEmptySlots />
          )}
        </div>

        <button
          type="button"
          onClick={handleLaunchToContact}
          disabled={launching}
          aria-busy={launching}
          aria-label="Launch down to Contact"
          className="absolute bottom-10 left-0 right-0 z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/25 bg-gradient-to-b from-white/[0.07] to-white/[0.02] text-cyan-300/90 shadow-[0_0_24px_rgba(103,232,249,0.1)] transition-all duration-300 hover:border-cyan-300/45 hover:translate-y-0.5 hover:text-cyan-200 hover:shadow-[0_0_36px_rgba(103,232,249,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </section>

      <section
        ref={contactSectionRef}
        id="contact"
        className="relative z-10 min-h-[100dvh] w-full scroll-mt-6"
        aria-labelledby="contact-heading"
      >
        <div className="flex min-h-[100dvh] w-full flex-col md:flex-row md:items-stretch">
          <div
            ref={contactAstroMountRef}
            className="relative mx-auto w-full min-h-[50vh] shrink-0 overflow-hidden md:mx-0 md:min-h-[100dvh] md:w-1/2 md:flex-shrink-0"
          >
            <div
              className={`about-astro-morph absolute inset-0 ${
                contactFlight ? "invisible" : ""
              } ${
                !contactFlight && contactInView && contactMorphLanded
                  ? "about-astro-morph--landed"
                  : ""
              } ${
                !contactFlight &&
                contactInView &&
                !contactMorphLanded &&
                contactUseCssFallback
                  ? "about-astro-morph--visible"
                  : ""
              }`}
            >
              <div className="about-astro-levitate absolute inset-0 h-full min-h-[280px] w-full md:min-h-[100dvh]">
                <Image
                  src="/assets/astro3.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-bottom object-left drop-shadow-[0_0_56px_rgba(103,232,249,0.32)] md:scale-[1.02] md:object-bottom"
                  priority={false}
                />
              </div>
            </div>
          </div>

          <div
            className={`flex w-full flex-col justify-center px-6 py-14 md:min-h-[100dvh] md:w-1/2 md:flex-shrink-0 md:px-10 md:py-16 lg:px-14 ${
              contactCopyRevealed ? "about-copy-reveal--visible" : ""
            }`}
          >
            <div className="about-copy-reveal">
              <ContactOutreach />
            </div>
            <div className="about-copy-reveal mt-8">
              <p className="text-sm leading-relaxed text-[#64748b]">
                Based in Zamboanga City · Open to remote collaboration
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
