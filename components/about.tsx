'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import anime from 'animejs';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            if (contentRef.current) {
              const children = contentRef.current.children;
              anime({
                targets: children,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                delay: anime.stagger(100),
                easing: 'cubicBezier(0.22, 1, 0.36, 1)',
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} id='about' className='flex min-h-screen items-center px-4 py-20'>
      <div className='mx-auto w-full max-w-4xl'>
        <div ref={contentRef} className='space-y-8'>
          <h2 className='mb-12 text-4xl font-bold md:text-5xl' style={{ opacity: 0 }}>
            About Me
          </h2>

          <div className='flex flex-col items-start gap-8 md:flex-row' style={{ opacity: 0 }}>
            <div className='relative shrink-0'>
              <div className='bg-muted border-border relative h-48 w-48 overflow-hidden rounded-xl border'>
                <Image
                  fill
                  src='/images/profile.jpeg'
                  alt='Theodore Damianidis'
                  className='object-cover'
                />
              </div>
            </div>

            <div className='text-muted-foreground flex-1 space-y-4 text-lg leading-relaxed'>
              <p>
                I'm a <span className='text-foreground font-semibold'>frontend engineer</span> with
                over 7 years of production experience crafting scalable, user-focused web
                applications. I specialize in React, TypeScript, GraphQL, and Tailwind CSS, with
                deep expertise in building modern, performant web experiences.
              </p>
              <p>
                My approach centers on writing maintainable, performant code that stands the test of
                time. I believe in deep understanding over surface-level solutions—taking the time
                to comprehend the full system architecture, identifying existing patterns, and
                building on solid foundations rather than quick fixes.
              </p>
              <p>
                Mentoring is at the heart of what I do. I find joy in helping engineers level up
                their skills, teaching them to think critically about code architecture, and
                fostering a culture where asking questions is encouraged and knowledge sharing is
                the norm.
              </p>
            </div>
          </div>

          <div
            className='bg-muted/30 border-border space-y-3 rounded-xl border p-6'
            style={{ opacity: 0 }}
          >
            <div className='text-primary text-sm font-medium'>Currently</div>
            <p className='text-foreground text-base leading-relaxed'>
              At Geekbot, I lead frontend architecture decisions, maintain our custom UI library,
              and mentor engineers to build products that users love. I'm passionate about clean
              code, modern design patterns, and creating experiences that feel effortless.
            </p>
          </div>

          <div
            className='text-muted-foreground space-y-4 text-base leading-relaxed'
            style={{ opacity: 0 }}
          >
            <p>
              Outside of work, I stay curious by exploring emerging web technologies, maintain
              balance through regular gym sessions, and recharge with hiking adventures. Based in
              Thessaloniki, Greece, I'm always excited to connect with fellow professionals and explore
              new opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
