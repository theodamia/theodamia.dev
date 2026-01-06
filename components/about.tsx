'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import anime from 'animejs';

const SKILLS = ['React', 'TypeScript', 'GraphQL', 'TailwindCSS'];

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
    <section ref={sectionRef} id='about' className='flex items-center px-4 py-20'>
      <div className='mx-auto w-full max-w-6xl'>
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
                I'm a Lead Frontend Engineer with over 7 years of experience building and evolving
                production web applications.
              </p>
              <p>
                I've learned that the trickiest part of the job is often navigating
                ambiguity—figuring out what to build, not just how to build it and making decisions
                that hold up as a product grows.
              </p>
              <p>
                Mentoring is at the heart of what I do. I enjoy helping engineers level up by
                reviewing designs and code, encouraging thoughtful architectural decisions and
                fostering a culture where questions are welcome and knowledge sharing is the norm.
              </p>
              <div className='flex flex-wrap gap-2 pt-2'>
                {SKILLS.map(skill => (
                  <span
                    key={skill}
                    className='bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-1 text-sm font-medium'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className='bg-muted/30 border-border space-y-3 rounded-xl border p-6'
            style={{ opacity: 0 }}
          >
            <div className='text-primary text-sm font-medium'>Currently</div>
            <p className='text-foreground text-base leading-relaxed'>
              At Geekbot for 7 years, currently leading the frontend team and building the majority
              of the frontend from the ground up. Beyond code, I've helped shape how the team
              works—prioritizing clarity, honest feedback and steady progress when things get messy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
