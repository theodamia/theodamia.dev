'use client';

import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

const EXPERIENCES = [
  {
    title: 'Frontend Lead',
    company: 'Geekbot',
    period: 'Mar 2022 - Present',
    duration: '3 years',
    description:
      "Built and maintained the majority of the frontend over the years. Created the company's internal UI library, introduced Tailwind and Atomic Design patterns, and kept the codebase sustainable as the product evolved. Mentor engineers and help shape both technical direction and team processes.",
    active: true,
  },
  {
    title: 'Frontend Engineer',
    company: 'Geekbot',
    period: 'Sep 2018 - Feb 2022',
    duration: '3 years 5 months',
    description:
      "Developed and optimized the company's web application using modern frontend architecture and workflows. Collaborated closely with Product, Design and UX teams to deliver user-focused features while ensuring code quality through comprehensive debugging and code reviews.",
    active: false,
  },
  {
    title: 'Junior Frontend Engineer',
    company: 'Ordereze',
    period: 'Jan 2016 - Jan 2017',
    duration: '1 year',
    description:
      'Built and updated user interfaces using React and PostCSS, focusing on creating maintainable and performant code. Worked closely with QA teams to identify and resolve bugs.',
    active: false,
  },
  {
    title: 'Web Developer Internship',
    company: 'Fedenet',
    period: 'Jul 2015 - Dec 2015',
    duration: '6 months',
    description:
      'Built and customized websites using JavaScript, PHP and a proprietary CMS. Collaborated with senior engineers to implement dynamic features while optimizing website performance.',
    active: false,
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            anime({
              targets: dotsRef.current.filter(Boolean),
              scale: [0, 1],
              opacity: [0, 1],
              duration: 600,
              delay: anime.stagger(150),
              easing: 'easeOutElastic(1, .8)',
            });

            anime({
              targets: cardsRef.current.filter(Boolean),
              opacity: [0, 1],
              translateX: [-30, 0],
              duration: 1000,
              delay: anime.stagger(200, { start: 400 }),
              easing: 'cubicBezier(0.22, 1, 0.36, 1)',
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} id='experience' className='px-4 py-20'>
      <div className='mx-auto max-w-6xl'>
        <h2 className='mb-12 text-4xl font-bold md:text-5xl'>Experience</h2>

        <div className='relative'>
          {/* Timeline line */}
          <div
            className='absolute left-0 top-0 hidden h-full w-px bg-border md:block md:left-[11px]'
            aria-hidden='true'
          />

          <div className='flex flex-col gap-12'>
            {EXPERIENCES.map((exp, index) => (
              <div key={exp.title + exp.company} className='group relative flex flex-col gap-4 md:flex-row md:gap-8'>
                {/* Timeline dot */}
                <div className='hidden md:block'>
                  <div
                    ref={el => {
                      dotsRef.current[index] = el;
                    }}
                    className={`relative z-10 mt-2 h-[23px] w-[23px] rounded-full border-2 transition-colors ${
                      exp.active
                        ? 'border-primary bg-primary/20'
                        : 'border-border bg-background group-hover:border-primary/50'
                    }`}
                    style={{ opacity: 0, transform: 'scale(0)' }}
                  >
                    {exp.active && (
                      <span className='absolute inset-1 rounded-full bg-primary' />
                    )}
                  </div>
                </div>

                {/* Content card */}
                <div
                  ref={el => {
                    cardsRef.current[index] = el;
                  }}
                  className={`flex-1 rounded-lg border p-6 transition-all ${
                    exp.active
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card hover:border-primary/20'
                  }`}
                  style={{ opacity: 0 }}
                >
                  <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <h3 className='text-xl font-semibold text-foreground'>
                        {exp.title}
                      </h3>
                      <span className='text-lg text-primary'>
                        {exp.company}
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Badge variant='secondary' className='shrink-0'>
                        {exp.duration}
                      </Badge>
                    </div>
                  </div>
                  <p className='mb-3 text-sm text-muted-foreground'>
                    {exp.period}
                  </p>
                  <p className='text-sm leading-relaxed text-muted-foreground'>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
