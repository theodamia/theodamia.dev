'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    return savedTheme || systemTheme;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Connect' },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 border-border border-b shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='text-foreground hover:text-primary text-xl font-bold transition-colors'
          >
            TD
          </button>

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-8 md:flex'>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className='text-muted-foreground hover:text-primary group relative text-sm font-medium transition-colors'
              >
                {link.label}
                <span className='bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full' />
              </button>
            ))}
            <Button
              variant='outline'
              size='icon'
              onClick={toggleTheme}
              className='rounded-full bg-transparent'
              aria-label='Toggle theme'
            >
              {theme === 'light' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className='flex items-center gap-3 md:hidden'>
            <Button
              variant='outline'
              size='icon'
              onClick={toggleTheme}
              className='rounded-full bg-transparent'
              aria-label='Toggle theme'
            >
              {theme === 'light' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='text-foreground hover:text-primary transition-colors'
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-border border-t py-4 md:hidden'>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className='text-muted-foreground hover:text-primary hover:bg-muted/50 block w-full rounded-md px-4 py-3 text-left text-sm font-medium transition-colors'
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
