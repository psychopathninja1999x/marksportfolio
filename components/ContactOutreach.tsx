import Link from "next/link";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

/** Edit these for your live portfolio */
const EMAIL = "mvitem5@gmail.com";
const MAILTO = `mailto:${EMAIL}`;
const GITHUB_HREF = "https://github.com/psychopathninja1999x";
const LINKEDIN_HREF = "https://linkedin.com/";

export function ContactOutreach() {
  return (
    <div className="w-full max-w-xl">
      <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan-400/70">
      CONTACT ME
      </p>
      <h2
        id="contact-heading"
        className="text-3xl font-semibold tracking-tight text-[#e8eaef] sm:text-4xl"
      >
        <span className="galaxy-name-gradient font-semibold">Contact</span>
      </h2>
      <p className="mt-6 text-pretty text-[0.95rem] leading-relaxed text-[#94a3b8] md:text-base">
        Have a project in mind, a role to discuss, or just want to say hello?
        Send a message — I&apos;ll get back when I&apos;m back from orbit.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={MAILTO}
          className="group inline-flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/45 hover:bg-white/[0.07]"
        >
          <FaEnvelope
            className="h-5 w-5 text-cyan-300/90"
            aria-hidden
          />
          <span>{EMAIL}</span>
        </a>
      </div>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-[#64748b]">
        Elsewhere
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        <li>
          <Link
            href={GITHUB_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-sm text-[#e8eaef] transition hover:border-cyan-400/35 hover:text-cyan-100"
          >
            <FaGithub className="h-4 w-4" aria-hidden />
            GitHub
          </Link>
        </li>
        <li>
          <Link
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-sm text-[#e8eaef] transition hover:border-cyan-400/35 hover:text-cyan-100"
          >
            <FaLinkedin className="h-4 w-4" aria-hidden />
            LinkedIn
          </Link>
        </li>
      </ul>
    </div>
  );
}
