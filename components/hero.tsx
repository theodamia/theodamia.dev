'use client';

import { Button } from '@/components/ui/button';
import { Github, Linkedin, ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { AnimatedGrid } from './animated-grid';

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1200,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)',
      });
    }

    if (subtitleRef.current) {
      anime({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 400,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)',
      });
    }

    if (buttonsRef.current) {
      anime({
        targets: buttonsRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 800,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)',
      });
    }
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='relative flex min-h-screen w-full items-center justify-center overflow-hidden'>
      <AnimatedGrid />

      <div className='relative z-10 mx-auto max-w-4xl px-4 py-20 text-center'>
        <h1
          ref={titleRef}
          className='mb-6 text-5xl font-bold text-balance md:text-7xl'
          style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', opacity: 0 }}
        >
          Theodore Damianidis
        </h1>
        <p
          ref={subtitleRef}
          className='text-muted-foreground mb-8 text-xl text-balance md:text-2xl'
          style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.08)', opacity: 0 }}
        >
          Frontend Engineer crafting scalable web experiences with React, TypeScript and modern
          tools
        </p>
        <div
          ref={buttonsRef}
          className='flex items-center justify-center gap-4'
          style={{ opacity: 0 }}
        >
          <Button asChild size='lg' className='pointer-events-auto'>
            <a href='#contact'>Get In Touch</a>
          </Button>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='pointer-events-auto bg-transparent'
          >
            <a
              href='https://github.com/theodamia'
              target='_blank'
              rel='noopener noreferrer'
              className='gap-2'
            >
              <Github className='h-5 w-5' />
              GitHub
            </a>
          </Button>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='pointer-events-auto bg-transparent'
          >
            <a
              href='https://www.linkedin.com/in/theodore-damianidis-19369714a/'
              target='_blank'
              rel='noopener noreferrer'
              className='gap-2'
            >
              <Linkedin className='h-5 w-5' />
              LinkedIn
            </a>
          </Button>
        </div>
      </div>
      <button
        onClick={scrollToAbout}
        className='pointer-events-auto absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce'
        aria-label='Scroll to about section'
      >
        <ArrowDown className='text-muted-foreground h-6 w-6' />
      </button>
    </section>
  );
}
