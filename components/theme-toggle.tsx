'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const resolvedTheme = savedTheme || systemTheme;
    setTheme(resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      className={`group rounded-full bg-transparent ${
        !isDark ? 'hover:bg-gray-900 dark:hover:bg-gray-900' : ''
      }`}
      aria-label='Toggle theme'
      suppressHydrationWarning
    >
      {mounted ? (
        isDark ? (
          <Sun className='h-4 w-4 transition-colors group-hover:text-yellow-500' />
        ) : (
          <Moon className='h-4 w-4 transition-colors group-hover:text-white' />
        )
      ) : (
        <span className='h-4 w-4' />
      )}
    </Button>
  );
}
