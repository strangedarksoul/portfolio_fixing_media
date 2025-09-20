import { ProjectDetail } from '@/components/projects/project-detail';
import { projectsAPI } from '@/lib/api';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const response = await projectsAPI.getProjects();
    const projects = response.data.results || [];
    
    return projects.map((project: any) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for projects:', error);
    return [];
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetail slug={params.slug} />;
}