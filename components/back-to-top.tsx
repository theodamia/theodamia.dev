'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import anime from 'animejs';

const SCROLL_THRESHOLD = 300;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isVisible) {
      anime({
        targets: '.back-to-top-button',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutElastic(1, .6)',
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className='back-to-top-button bg-primary text-primary-foreground focus:ring-primary fixed right-8 bottom-8 z-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none'
      aria-label='Back to top'
    >
      <ArrowUp className='h-5 w-5' />
    </button>
  );
}
