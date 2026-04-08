import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/lib/projects";

type ProjectPreviewCardProps = {
  project: Project;
};

/**
 * Home `#works` — shipped projects: image + links. `comingSoon`: dashed placeholder, no routes.
 */
export function ProjectPreviewCard({ project }: ProjectPreviewCardProps) {
  if (project.comingSoon) {
    return (
      <article
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-cyan-400/22 bg-white/[0.02] shadow-none"
        aria-label={`${project.title} — not yet published`}
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#070a12]">
          <div
            className="absolute inset-0 opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% 80%, rgba(103, 232, 249, 0.08), transparent 60%), linear-gradient(165deg, rgba(25, 35, 55, 0.9) 0%, rgba(3, 4, 8, 0.95) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-cyan-400/30 bg-black/40 px-4 py-2 font-mono text-[10px] tracking-[0.35em] text-cyan-300/90 backdrop-blur-sm">
              TO BE ADDED
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="text-lg font-semibold tracking-tight text-[#94a3b8]">
            {project.title}
          </h3>
          <p className="text-pretty text-sm leading-relaxed text-[#64748b]">
            {project.description}
          </p>
          {project.tags && project.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-[#64748b]"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-auto pt-2">
            <span className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-medium text-[#64748b]">
              In development
            </span>
          </div>
        </div>
      </article>
    );
  }

  const hasImage = Boolean(project.image);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_0_0_1px_rgba(103,232,249,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-cyan-400/35 hover:shadow-[0_0_40px_rgba(103,232,249,0.14)]">
      {hasImage ? (
        <Link
          href={`/works/${project.slug}`}
          className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#0a0c14] outline-none ring-0 transition-[box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/60 group-hover:shadow-[inset_0_0_0_1px_rgba(103,232,249,0.22),0_0_32px_rgba(103,232,249,0.12)]"
          aria-label={`Learn more about ${project.title}`}
        >
          <Image
            src={project.image!}
            alt=""
            fill
            className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] scale-100 brightness-[0.98] group-hover:scale-[1.06] group-hover:brightness-105 motion-reduce:scale-100 motion-reduce:brightness-100 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:brightness-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030408]/60 via-[#030408]/5 to-[#030408]/20 transition-opacity duration-500 group-hover:from-[#030408]/35 group-hover:via-transparent group-hover:to-[#030408]/8"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, rgba(103, 232, 249, 0.14), transparent 55%)",
            }}
            aria-hidden
          />
          {project.year ? (
            <span className="absolute right-3 top-3 z-[1] rounded-full border border-white/15 bg-black/45 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-cyan-200/95 backdrop-blur-sm transition-colors duration-300 group-hover:border-cyan-400/35 group-hover:bg-black/55">
              {project.year}
            </span>
          ) : null}
        </Link>
      ) : (
        <div className="relative aspect-[16/10] w-full bg-[#0a0c14]">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(103, 232, 249, 0.12), transparent 70%), linear-gradient(165deg, rgba(30, 40, 70, 0.5) 0%, transparent 55%)",
            }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold tracking-tight text-[#e8eaef] transition-colors duration-300 group-hover:text-cyan-50/95">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-pretty text-sm leading-relaxed text-[#94a3b8]">
          {project.description}
        </p>
        {project.tags && project.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {project.tags.slice(0, 6).map((t) => (
              <li
                key={t}
                className="rounded-md border border-white/[0.12] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-cyan-200/75"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/works/${project.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-b from-white/[0.12] to-white/[0.04] px-5 py-2 text-sm font-semibold text-cyan-50 shadow-[0_0_20px_rgba(103,232,249,0.12)] transition hover:border-cyan-300/55 hover:shadow-[0_0_28px_rgba(103,232,249,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60"
          >
            Learn more
          </Link>
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-2 text-sm font-medium text-[#e8eaef] transition hover:border-white/25 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60"
            >
              <FaGithub className="h-[1.1rem] w-[1.1rem] text-[#e8eaef]" aria-hidden />
              GitHub
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
