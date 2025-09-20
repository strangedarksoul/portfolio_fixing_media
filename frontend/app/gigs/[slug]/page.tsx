import { GigDetail } from '@/components/gigs/gig-detail';
import { gigsAPI } from '@/lib/api';

interface GigPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const response = await gigsAPI.getGigs();
    const gigs = response.data.results || [];
    
    return gigs.map((gig: any) => ({
      slug: gig.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for gigs:', error);
    return [];
  }
}

export default function GigPage({ params }: GigPageProps) {
  return <GigDetail slug={params.slug} />;
}