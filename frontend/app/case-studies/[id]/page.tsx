import { CaseStudyDetail } from '@/components/case-studies/case-study-detail';
import { projectsAPI } from '@/lib/api';

interface CaseStudyPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  try {
    const response = await projectsAPI.getCaseStudies();
    const caseStudies = response.data.results || [];
    
    return caseStudies.map((caseStudy: any) => ({
      id: caseStudy.id.toString(),
    }));
  } catch (error) {
    console.error('Failed to generate static params for case studies:', error);
    return [];
  }
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  return <CaseStudyDetail id={params.id} />;
}