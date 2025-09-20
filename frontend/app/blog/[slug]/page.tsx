import { BlogPostDetail } from '@/components/blog/blog-post-detail';
import { blogAPI } from '@/lib/api';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const response = await blogAPI.getPosts();
    const posts = response.data.results || [];
    
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for blog posts:', error);
    return [];
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostDetail slug={params.slug} />;
}