'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { SCROLL_THRESHOLD } from '@/lib/constants';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD.NAVBAR_VISIBLE);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 right-0 left-0 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 border-border border-b shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
      style={{ zIndex: 50 }}
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
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className='flex items-center gap-3 md:hidden'>
            <ThemeToggle />
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
