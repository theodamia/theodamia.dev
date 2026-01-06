'use client';

import { Card } from '@/components/ui/card';
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
      "Built and maintained the majority of the frontend over the years. Created the company's internal UI library, introduced Tailwind and Atomic Design patterns, and kept the codebase sustainable as the product evolved. Mentor engineers and help shape both technical direction and team processes that keep work moving forward.",
  },
  {
    title: 'Frontend Engineer',
    company: 'Geekbot',
    period: 'Sep 2018 - Feb 2022',
    duration: '3 years 5 months',
    description:
      "Developed and optimized the company's web application using modern frontend architecture and workflows. Collaborated closely with Product, Design and UX teams to deliver user-focused features while ensuring code quality through comprehensive debugging and code reviews.",
  },
  {
    title: 'Junior Frontend Engineer',
    company: 'Ordereze',
    period: 'Jan 2016 - Jan 2017',
    duration: '1 year',
    description:
      'Built and updated user interfaces using React and PostCSS, focusing on creating maintainable and performant code. Worked closely with QA teams to identify and resolve bugs, conducting regular code cleanup to improve overall project quality.',
  },
  {
    title: 'Web Developer Internship',
    company: 'Fedenet',
    period: 'Jul 2015 - Dec 2015',
    duration: '6 months',
    description:
      'Built and customized websites using JavaScript, PHP and a proprietary CMS. Collaborated with senior engineers to implement dynamic features while optimizing website performance and responsiveness across different devices.',
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
              translateX: [-50, 0],
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

  const handleCardHover = (index: number, isHovering: boolean) => {
    const card = cardsRef.current[index];
    if (!card) return;

    anime({
      targets: card,
      translateY: isHovering ? -8 : 0,
      scale: isHovering ? 1.02 : 1,
      duration: 400,
      easing: 'easeOutCubic',
    });
  };

  return (
    <section ref={sectionRef} id='experience' className='px-4 py-20'>
      <div className='mx-auto max-w-6xl'>
        <h2 className='mb-12 text-4xl font-bold md:text-5xl'>Experience</h2>
        <div className='relative'>
          {/* Vertical timeline line */}
          <div className='bg-border absolute top-0 bottom-0 left-0 w-0.5 md:left-1/2 md:-ml-px' />

          <div className='space-y-12'>
            {EXPERIENCES.map((exp, index) => (
              <div key={index} className='relative'>
                <div
                  ref={el => {
                    dotsRef.current[index] = el;
                  }}
                  className='bg-primary border-background absolute top-2 left-0 z-10 h-4 w-4 rounded-full border-4 md:left-1/2 md:-ml-2'
                  style={{ opacity: 0, transform: 'scale(0)' }}
                />

                <div
                  ref={el => {
                    cardsRef.current[index] = el;
                  }}
                  className={`group ml-8 md:ml-0 md:w-[calc(54%-2rem)] ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                  style={{ opacity: 0 }}
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                >
                  <Card className='experience-card border-border group-hover:border-primary cursor-pointer p-6 transition-all hover:shadow-lg'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <h3 className='text-foreground text-xl font-semibold'>{exp.title}</h3>
                          <p className='text-primary text-lg'>{exp.company}</p>
                        </div>
                        <Badge variant='secondary' className='shrink-0'>
                          {exp.duration}
                        </Badge>
                      </div>
                      <p className='text-muted-foreground text-sm'>{exp.period}</p>
                    </div>
                    <p className='text-muted-foreground leading-relaxed'>{exp.description}</p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
