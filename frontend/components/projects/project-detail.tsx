'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useChatStore } from '@/lib/store';
import { projectsAPI } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { 
  ExternalLink, 
  Github, 
  Calendar, 
  Users, 
  MessageSquare,
  ArrowLeft,
  FileText,
  BarChart3,
  Zap,
  Eye,
  Play,
  Maximize,
  Download,
  Share2,
  Heart,
  Clock,
  Target,
  Code2,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Lightbulb,
  Cloud,
  Wrench
} from 'lucide-react';

interface ProjectDetailProps {
  slug: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  short_tagline: string;
  description_short: string;
  description_long: string;
  role: string;
  start_date: string;
  end_date?: string;
  duration: string;
  is_ongoing: boolean;
  hero_image?: string;
  hero_video?: string;
  gallery_images: string[];
  repo_url?: string;
  live_demo_url?: string;
  case_study_url?: string;
  metrics: Record<string, any>;
  skills: Array<{ name: string; color: string; category: string }>;
  tech_stack: Array<{ name: string; color: string; category: string }>;
  collaborations: Array<{ name: string; role: string; contribution: string; profile_url?: string; avatar?: string }>;
  updates: Array<{ title: string; content: string; update_type: string; created_at: string; is_major: boolean }>;
  view_count: number;
  is_featured: boolean;
  has_case_study: boolean;
  case_study_id?: number;
  created_at: string;
  updated_at: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  
  const { setIsOpen: setChatOpen, setContext } = useChatStore();

  useEffect(() => {
    loadProject();
  }, [slug]);

  const loadProject = async () => {
    try {
      const response = await projectsAPI.getProject(slug);
      setProject(response.data);
      
      // Track project view
      analytics.projectView(response.data.id, response.data.title, response.data.slug);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatAboutProject = () => {
    if (project) {
      setContext({ project_id: project.id, project_title: project.title });
      setChatOpen(true);
      analytics.track('chat_opened_from_project_detail', { project_id: project.id });
    }
  };

  const handleShare = () => {
    if (navigator.share && project) {
      navigator.share({
        title: project.title,
        text: project.short_tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    analytics.track('project_shared', { project_id: project?.id });
  };

  // Create media items array combining hero video and gallery images
  const getMediaItems = () => {
    if (!project) return [];
    
    const items = [];
    
    // Add hero video if available
    if (project.hero_video) {
      items.push({
        type: 'video',
        url: project.hero_video,
        title: `${project.title} - Demo Video`
      });
    }
    
    // Add hero image if available and no video
    if (project.hero_image && !project.hero_video) {
      items.push({
        type: 'image',
        url: project.hero_image,
        title: `${project.title} - Hero Image`
      });
    }
    
    // Add gallery images
    project.gallery_images.forEach((image, index) => {
      items.push({
        type: 'image',
        url: image,
        title: `${project.title} - Gallery ${index + 1}`
      });
    });
    
    return items;
  };

  const renderMediaItem = (item: any, index: number) => {
    const isVideo = item.type === 'video' || item.url.includes('youtube.com') || item.url.includes('vimeo.com') || 
                   item.url.endsWith('.mp4') || item.url.endsWith('.webm') || item.url.endsWith('.ogg');
    
    if (isVideo) {
      if (item.url.includes('youtube.com') || item.url.includes('vimeo.com')) {
        // Embedded video
        return (
          <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden">
            <iframe
              src={item.url}
              title={item.title}
              className="w-full h-full"
              allowFullScreen
            />
          </AspectRatio>
        );
      } else {
        // Direct video file
        return (
          <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden">
            <video
              src={item.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          </AspectRatio>
        );
      }
    } else {
      // Image
      return (
        <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden cursor-pointer group">
          <Image
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={800}
            height={450}
            unoptimized={true}
            onClick={() => {
              setSelectedMediaIndex(index);
              setIsMediaDialogOpen(true);
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </AspectRatio>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const mediaItems = getMediaItems();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {project.hero_image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={project.hero_image}
              alt={project.title}
              className="w-full h-full object-cover"
              width={1200}
              height={600}
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
        )}
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/projects">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  {project.is_featured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {project.role.replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {project.view_count} views
                  </div>
                  {project.is_ongoing && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {project.title}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {project.short_tagline}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{project.duration}</span>
                    </div>
                    {project.collaborations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{project.collaborations.length + 1} contributors</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {project.live_demo_url && (
                    <Button
                      onClick={() => {
                        window.open(project.live_demo_url!, '_blank');
                        analytics.linkClick('project_demo', project.live_demo_url!);
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Live Demo
                    </Button>
                  )}
                  
                  {project.repo_url && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        window.open(project.repo_url!, '_blank');
                        analytics.linkClick('project_repo', project.repo_url!);
                      }}
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View Code
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleChatAboutProject}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Ask About This
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Case Study CTA */}
                {project.has_case_study && project.case_study_id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">Director's Cut Available</CardTitle>
                            <CardDescription>
                              Dive deeper into the challenges, solutions, and detailed outcomes of this project
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get an in-depth look at the problem-solving process, technical decisions, architecture choices, 
                          and measurable results that made this project successful.
                        </p>
                        <Link href={`/case-studies/${project.case_study_id}`}>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            <FileText className="w-4 h-4 mr-2" />
                            Read Director's Cut
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                {Object.keys(project.metrics).length > 0 && (
                  <Card className="bg-gradient-to-br from-background to-muted/30 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        Impact Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400 mb-1">{value}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Tech Stack Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-blue-400" />
                      Tech Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 8).map((skill) => (
                        <Badge 
                          key={skill.name} 
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: skill.color, color: skill.color }}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                      {project.skills.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skills.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Project Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={project.is_ongoing ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                        {project.is_ongoing ? 'Ongoing' : 'Completed'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Started</span>
                      <span className="text-sm">{new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                    {project.end_date && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="text-sm">{new Date(project.end_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm">{project.duration}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Interested in this project?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleChatAboutProject}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Discuss This Project
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = '/hire-me'}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Start Similar Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Gallery Section */}
      {mediaItems.length > 0 && (
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Project Gallery</h2>
                <p className="text-muted-foreground">
                  Visual showcase of the project's development and final results
                </p>
              </div>

              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {mediaItems.map((item, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative group"
                      >
                        {renderMediaItem(item, index)}
                        
                        {/* Media overlay with title */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-medium">{item.title}</p>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </motion.div>
          </div>
        </section>
      )}

      {/* Content Tabs */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Tech Stack
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Updates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-yellow-400" />
                      Project Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-invert prose-lg max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: project.description_long }}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Key Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Key Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                        <Code2 className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <h3 className="font-semibold mb-2">Clean Architecture</h3>
                        <p className="text-sm text-muted-foreground">
                          Modular, maintainable code structure following best practices
                        </p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                        <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-400" />
                        <h3 className="font-semibold mb-2">Performance Optimized</h3>
                        <p className="text-sm text-muted-foreground">
                          Fast loading times and efficient resource utilization
                        </p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                        <Award className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                        <h3 className="font-semibold mb-2">User-Centered Design</h3>
                        <p className="text-sm text-muted-foreground">
                          Intuitive interface designed with user experience in mind
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['language', 'framework', 'database', 'tool', 'cloud', 'library'].map((category) => {
                  const categorySkills = project.skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;

                  const getCategoryIcon = (cat: string) => {
                    switch (cat) {
                      case 'language': return Code2;
                      case 'framework': return Layers;
                      case 'database': return BarChart3;
                      case 'tool': return Wrench;
                      case 'cloud': return Cloud;
                      case 'library': return FileText;
                      default: return Code2;
                    }
                  };

                  const CategoryIcon = getCategoryIcon(category);

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-lg capitalize flex items-center gap-2">
                            <CategoryIcon className="w-5 h-5 text-purple-400" />
                            {category === 'language' ? 'Languages' : category + 's'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {categorySkills.map((skill) => (
                              <div key={skill.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div 
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: skill.color }}
                                />
                                <span className="text-sm font-medium">{skill.name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              {project.collaborations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Project Lead (Edzio) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            E
                          </div>
                          <div>
                            <CardTitle className="text-lg">Edzio</CardTitle>
                            <CardDescription className="capitalize">{project.role.replace('_', ' ')}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Project lead responsible for architecture, development, and delivery.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Collaborators */}
                  {project.collaborations.map((collab, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 1) * 0.1, duration: 0.6 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            {collab.avatar ? (
                              <Image
                                src={collab.avatar}
                                alt={collab.name}
                                className="w-12 h-12 rounded-full object-cover"
                                width={48}
                                height={48}
                                unoptimized={true}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {collab.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg">{collab.name}</CardTitle>
                              <CardDescription>{collab.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {collab.contribution}
                          </p>
                          {collab.profile_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.open(collab.profile_url, '_blank');
                                analytics.linkClick('collaborator_profile', collab.profile_url);
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Solo Development</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This project was independently developed by Edzio, showcasing full-stack capabilities 
                    and end-to-end project ownership.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="updates" className="space-y-6">
              {project.updates.length > 0 ? (
                <div className="space-y-6">
                  {project.updates.map((update, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className={`hover:shadow-lg transition-all duration-300 ${
                        update.is_major ? 'border-purple-500/40 bg-gradient-to-br from-purple-500/5 to-pink-500/5' : ''
                      }`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {update.is_major && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                  <Sparkles className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <div>
                                <CardTitle className="text-xl">{update.title}</CardTitle>
                                <CardDescription>
                                  {new Date(update.created_at).toLocaleDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge 
                                variant="outline" 
                                className={`capitalize ${
                                  update.update_type === 'feature' ? 'border-green-500/50 text-green-400' :
                                  update.update_type === 'improvement' ? 'border-blue-500/50 text-blue-400' :
                                  update.update_type === 'bugfix' ? 'border-yellow-500/50 text-yellow-400' :
                                  update.update_type === 'security' ? 'border-red-500/50 text-red-400' :
                                  'border-purple-500/50 text-purple-400'
                                }`}
                              >
                                {update.update_type.replace('_', ' ')}
                              </Badge>
                              {update.is_major && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                  Major
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div 
                            className="prose prose-invert prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: update.content }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">No Updates Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Check back later for project updates, new features, and improvements.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inspired by this project?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how I can bring similar innovation and technical excellence to your next project.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleChatAboutProject}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Discuss This Project
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/hire-me'}
              >
                <Heart className="mr-2 w-5 h-5" />
                Start Similar Project
              </Button>

              {project.live_demo_url && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(project.live_demo_url!, '_blank')}
                >
                  <ExternalLink className="mr-2 w-5 h-5" />
                  Try Live Demo
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Dialog for Full-Screen View */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            {mediaItems[selectedMediaIndex] && (
              <div className="w-full h-full flex items-center justify-center">
                {renderMediaItem(mediaItems[selectedMediaIndex], selectedMediaIndex)}
              </div>
            )}
            
            {/* Navigation arrows for dialog */}
            {mediaItems.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedMediaIndex(prev => prev > 0 ? prev - 1 : mediaItems.length - 1)}
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedMediaIndex(prev => prev < mediaItems.length - 1 ? prev + 1 : 0)}
                >
                  →
                </Button>
              </>
            )}
            
            {/* Media counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedMediaIndex + 1} / {mediaItems.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}