'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analytics } from '@/lib/analytics';
import { 
  Home, 
  User, 
  Briefcase, 
  Code, 
  MessageSquare, 
  Trophy, 
  Star,
  FileText,
  Target,
  Gamepad2,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  Eye,
  Heart
} from 'lucide-react';

interface ExpandedNavPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationCategories = [
  {
    title: "Explore My Work",
    description: "Dive into projects and technical expertise",
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
    links: [
      { href: '/projects', label: 'Projects', icon: Code, description: 'Portfolio showcase' },
      { href: '/skills', label: 'Skills', icon: Trophy, description: 'Tech constellation' },
      { href: '/playground', label: 'Playground', icon: Gamepad2, description: 'Experiments & demos' },
      { href: '/case-studies', label: 'Case Studies', icon: FileText, description: 'Deep dives' },
    ]
  },
  {
    title: "Get to Know Me",
    description: "Personal story and professional journey",
    icon: User,
    gradient: "from-purple-500 to-pink-500",
    links: [
      { href: '/about', label: 'About', icon: User, description: 'My story' },
      { href: '/resume', label: 'Resume', icon: FileText, description: 'Professional history' },
      { href: '/achievements', label: 'Achievements', icon: Award, description: 'Milestones & awards' },
      { href: '/testimonials', label: 'Testimonials', icon: Star, description: 'Client feedback' },
    ]
  },
  {
    title: "Services & Content",
    description: "What I offer and share with the community",
    icon: Briefcase,
    gradient: "from-green-500 to-emerald-500",
    links: [
      { href: '/gigs', label: 'Services', icon: Briefcase, description: 'Ready-to-go solutions' },
      { href: '/blog', label: 'Blog', icon: BookOpen, description: 'Insights & tutorials' },
      { href: '/roadmap', label: 'Roadmap', icon: Target, description: 'Future plans' },
      { href: '/hire-me', label: 'Hire Me', icon: Zap, description: 'Start a project' },
    ]
  }
];

export function ExpandedNavPanel({ isOpen, onClose }: ExpandedNavPanelProps) {
  const pathname = usePathname();

  const handleLinkClick = (href: string, label: string) => {
    analytics.track('navigation_link_click', { 
      from: 'floating_nav', 
      to: href, 
      label 
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <Card className="w-full max-w-6xl max-h-full overflow-y-auto bg-background/95 backdrop-blur-lg border-purple-500/20 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Navigation Portal
                </CardTitle>
                <CardDescription className="text-lg">
                  Choose your path through the digital realm
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {navigationCategories.map((category, categoryIndex) => {
                    const CategoryIcon = category.icon;
                    
                    return (
                      <motion.div
                        key={category.title}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.6 }}
                        className="space-y-4"
                      >
                        <Card className={`bg-gradient-to-br ${category.gradient}/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300`}>
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center`}>
                                <CategoryIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{category.title}</CardTitle>
                                <CardDescription className="text-sm">
                                  {category.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-2">
                            {category.links.map((link, linkIndex) => {
                              const LinkIcon = link.icon;
                              const isActive = pathname === link.href;
                              
                              return (
                                <motion.div
                                  key={link.href}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    delay: 0.4 + categoryIndex * 0.1 + linkIndex * 0.05, 
                                    duration: 0.4 
                                  }}
                                >
                                  <Link href={link.href}>
                                    <Button
                                      variant={isActive ? "default" : "ghost"}
                                      className={`w-full justify-start h-auto p-4 ${
                                        isActive 
                                          ? `bg-gradient-to-r ${category.gradient} text-white hover:opacity-90` 
                                          : 'hover:bg-muted/50'
                                      }`}
                                      onClick={() => handleLinkClick(link.href, link.label)}
                                    >
                                      <div className="flex items-center gap-3 w-full">
                                        <LinkIcon className="w-5 h-5 flex-shrink-0" />
                                        <div className="text-left flex-1">
                                          <div className="font-medium">{link.label}</div>
                                          <div className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                                            {link.description}
                                          </div>
                                        </div>
                                        {isActive && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-2 h-2 bg-white rounded-full"
                                          />
                                        )}
                                      </div>
                                    </Button>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-8 pt-8 border-t border-border/50"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                    <p className="text-muted-foreground">Jump straight to the most important destinations</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/hire-me">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={() => handleLinkClick('/hire-me', 'Hire Me Quick')}
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Hire Me
                      </Button>
                    </Link>
                    
                    <Link href="/projects">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleLinkClick('/projects', 'Projects Quick')}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        View Work
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        window.open('https://calendly.com/edzio', '_blank');
                        analytics.linkClick('quick_action', 'https://calendly.com/edzio', 'schedule');
                        onClose();
                      }}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </motion.div>

                {/* Easter Egg Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="mt-8 text-center"
                >
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Try typing "konami" anywhere on the site for a surprise
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}