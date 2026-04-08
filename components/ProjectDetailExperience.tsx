"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { ConstellationBackground } from "@/components/ConstellationBackground";
import type { Project } from "@/lib/projects";

type ProjectDetailExperienceProps = {
  project: Project;
};

export function ProjectDetailExperience({ project }: ProjectDetailExperienceProps) {
  const body = project.detail ?? project.description;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-transparent">
      <ConstellationBackground launchPhase="idle" position="fixed" />

      <article className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-24 pt-8 sm:px-8">
        <Link
          href="/#works"
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-cyan-300/85 transition-colors hover:text-cyan-200"
        >
          <FaArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            aria-hidden
          />
          Back to My Works
        </Link>

        <header className="works-landing">
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan-400/70">
            MISSION
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#e8eaef] sm:text-4xl md:text-5xl">
            <span className="galaxy-name-gradient">{project.title}</span>
          </h1>
          {project.year ? (
            <p className="mt-3 font-mono text-sm text-[#64748b]">{project.year}</p>
          ) : null}
        </header>

        {project.image ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0c14] shadow-[0_0_40px_rgba(103,232,249,0.08)]">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42rem"
              priority
            />
          </div>
        ) : null}

        {project.tags && project.tags.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-md border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-cyan-200/80"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-10 space-y-4 text-pretty text-base leading-relaxed text-[#94a3b8]">
          {body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {project.github || (project.links && project.links.length > 0) ? (
          <div className="mt-12 flex flex-wrap gap-4 border-t border-white/[0.1] pt-10">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-[#e8eaef] transition-colors hover:border-white/30 hover:bg-white/[0.12]"
              >
                <FaGithub className="h-[1.15rem] w-[1.15rem]" aria-hidden />
                View on GitHub
              </a>
            ) : null}
            {project.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-300/50 hover:bg-white/[0.07]"
              >
                {l.label}
                <FaExternalLinkAlt className="h-3.5 w-3.5 opacity-80" aria-hidden />
              </a>
            ))}
          </div>
        ) : null}
      </article>
    </div>
  );
}
