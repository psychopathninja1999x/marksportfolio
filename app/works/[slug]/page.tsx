import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailExperience } from "@/components/ProjectDetailExperience";
import { getProjectBySlug, getShippedProjectSlugs } from "@/lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getShippedProjectSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.comingSoon) {
    return { title: "Project | Mark" };
  }
  return {
    title: `${project.title} | Mark`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.comingSoon) {
    notFound();
  }
  return <ProjectDetailExperience project={project} />;
}
