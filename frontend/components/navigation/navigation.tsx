'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, usePortalStore } from '@/lib/store';
import { 
  Home, 
  User, 
  Briefcase, 
  Code, 
  MessageSquare, 
  Trophy, 
  Star,
  FileText,
  Menu,
  LogIn,
  LogOut,
  Settings,
  Target,
  Gamepad2,
  BookOpen,
  Award
} from 'lucide-react';

// Navigation categories for mobile drawer
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
      { href: '/hire-me', label: 'Hire Me', icon: MessageSquare, description: 'Start a project' },
    ]
  }
];

// Core navigation items for desktop header (reduced set)
const coreNavigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: Code },
  { href: '/gigs', label: 'Services', icon: Briefcase },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { userName } = usePortalStore();

  const displayName = isAuthenticated ? user?.display_name || user?.full_name : userName;

  const handleLogout = () => {
    logout();
    // Clear cookies and redirect will be handled by the auth store
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Edzio
              </span>
            </Link>

            {/* Core Navigation Links (Reduced) */}
            <div className="flex items-center space-x-1">
              {coreNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {displayName && (
                <span className="text-sm text-muted-foreground">
                  Welcome, {displayName}
                </span>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Edzio
            </span>
          </Link>

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                {displayName && (
                  <div className="px-4 py-2 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {displayName}
                    </span>
                  </div>
                )}

                {/* Home Link */}
                <Link href="/" onClick={() => setIsMobileOpen(false)}>
                  <Button
                    variant={pathname === '/' ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${
                      pathname === '/' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : ''
                    }`}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Home
                  </Button>
                </Link>

                <Separator />

                {/* Categorized Navigation */}
                <div className="space-y-6">
                  {navigationCategories.map((category, categoryIndex) => {
                    const CategoryIcon = category.icon;
                    
                    return (
                      <div key={category.title} className="space-y-0">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center`}>
                              <CategoryIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{category.title}</h3>
                              {/* <p className="text-xs text-muted-foreground">{category.description}</p> */}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {category.links.map((link) => {
                            const LinkIcon = link.icon;
                            const isActive = pathname === link.href;
                            
                            return (
                              <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)}>
                                <Button
                                  variant={isActive ? "default" : "ghost"}
                                  size="sm"
                                  className={`w-full justify-start h-auto px-2 py-1 ${
                                    isActive 
                                      ? `bg-gradient-to-r ${category.gradient} text-white` 
                                      : 'hover:bg-muted/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 w-full">
                                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                    <div className="text-left flex-1">
                                      <div className="font-medium text-sm">{link.label}</div>
                                      {/* <div className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                                        {link.description}
                                      </div> */}
                                    </div>
                                  </div>
                                </Button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* <Separator /> */}

                <div className="pt-4 border-t space-y-0">
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile" onClick={() => setIsMobileOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start px-2">
                          <Settings className="w-4 h-4 mr-3" />
                          Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start px-2" 
                        onClick={() => {
                          handleLogout();
                          setIsMobileOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsMobileOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start px-2">
                        <LogIn className="w-4 h-4 mr-3" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20" />
    </>
  );
}