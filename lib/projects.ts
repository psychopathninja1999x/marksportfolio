/**
 * Mission log — add projects here. They appear on the home `#works` section;
 * each opens on its own route: `/works/[slug]`.
 * Optional image: place files under `public/` and set `image` to e.g. `/assets/project-x.png`.
 */
export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  /** Short line for cards and meta */
  title: string;
  description: string;
  /** Longer write-up on `/works/[slug]` (falls back to `description` if omitted) */
  detail?: string;
  year?: string;
  tags?: string[];
  links?: ProjectLink[];
  /** Path under public/, e.g. `/assets/cover.png` */
  image?: string;
  /** Repository URL — shows GitHub button on cards and project page */
  github?: string;
  /** Placeholder — no detail page yet; card shows “coming soon” state */
  comingSoon?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "procon-registration-system",
    title: "PROCON REGISTRATION SYSTEM",
    description:
      "End-to-end registration and participant management for conferences and events—sign-up flows, records, and streamlined check-in.",
    detail:
      "PROCON Registration System supports organizers with dependable attendee onboarding, data capture, and operational workflows for professional conferences and large-scale events.",
    year: "2026",
    tags: ["Web"],
    image: "/assets/works/work1.png",
  },
  {
    slug: "rotapp",
    title: "ROTAPP",
    description:
      "Mobile app for Rotaract Club of Zamboanga City West—club news, events, and member engagement in your pocket.",
    detail:
      "ROTAPP connects members of the Rotaract Club of Zamboanga City West with announcements, activities, and community initiatives through a focused mobile experience.",
    year: "2026",
    tags: ["Mobile"],
    image: "/assets/works/work2.png",
  },
  {
    slug: "sumisip-app",
    title: "SUMISIP App",
    description:
      "Mobile app for the Municipality of Sumisip, Basilan—local services, information, and civic access for residents.",
    detail:
      "The SUMISIP App brings municipal services and community information to mobile devices, supporting transparency and easier access for people in Sumisip, Basilan.",
    year: "2026",
    tags: ["Mobile"],
    image: "/assets/works/work3.png",
  },
  {
    slug: "zzoomer-app",
    title: "ZZoomer App",
    description:
      "Mobile ordering experience for ZamboZoomer Food Delivery Services—menus, orders, and delivery tracking in Zamboanga.",
    detail:
      "ZZoomer powers the customer-facing mobile journey for ZamboZoomer Food Delivery Services, from browsing and checkout to following orders end to end.",
    year: "2026",
    tags: ["Mobile"],
    image: "/assets/works/work%204.png",
  },
  {
    slug: "dsos-digital-society-seniors",
    title: "DSOS",
    description:
      "Digital Society for Seniors (DSOS)—mobile app with Open-IT Czechia helping older adults build confidence with digital tools.",
    detail:
      "DSOS (Digital Society for Seniors) is a mobile initiative developed with Open-IT Czechia, aimed at seniors who want to navigate technology safely and stay socially connected.",
    year: "2026",
    tags: ["Mobile"],
    image: "/assets/works/work5.png",
  },
  {
    slug: "coming-soon-1",
    title: "Coming soon",
    description:
      "A new web project is in the pipeline—case study, stack, and visuals will land here when it ships.",
    tags: ["Web", "Coming soon"],
    comingSoon: true,
  },
  {
    slug: "coming-soon-2",
    title: "Coming soon",
    description:
      "Another mobile build is on the way—watch this space for release notes and screens.",
    tags: ["Mobile", "Coming soon"],
    comingSoon: true,
  },
  {
    slug: "coming-soon-3",
    title: "Coming soon",
    description:
      "Full-stack product work in progress—documentation and demo will follow.",
    tags: ["Full-stack", "Coming soon"],
    comingSoon: true,
  },
  {
    slug: "coming-soon-4",
    title: "Coming soon",
    description:
      "More portfolio pieces are queued—check back soon for the full write-up.",
    tags: ["Coming soon"],
    comingSoon: true,
  },
];

/** First N projects show in the main `#works` grid; the rest go under “Rest of the projects”. */
export const FEATURED_WORKS_COUNT = 3;

export function getFeaturedProjects(): Project[] {
  return PROJECTS.slice(0, FEATURED_WORKS_COUNT);
}

export function getRestProjects(): Project[] {
  return PROJECTS.slice(FEATURED_WORKS_COUNT);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Slugs that have a real `/works/[slug]` page (excludes placeholders). */
export function getShippedProjectSlugs(): { slug: string }[] {
  return PROJECTS.filter((p) => !p.comingSoon).map((p) => ({ slug: p.slug }));
}
