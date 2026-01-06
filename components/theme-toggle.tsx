'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    return savedTheme || systemTheme;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      className={`group rounded-full bg-transparent ${
        theme === 'light' ? 'hover:bg-gray-900 dark:hover:bg-gray-900' : ''
      }`}
      aria-label='Toggle theme'
    >
      {theme === 'light' ? (
        <Moon className='h-4 w-4 transition-colors group-hover:text-white' />
      ) : (
        <Sun className='h-4 w-4 transition-colors group-hover:text-yellow-500' />
      )}
    </Button>
  );
}
