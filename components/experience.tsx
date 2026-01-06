'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

const EXPERIENCES = [
  {
    id: 1,
    title: 'Frontend Lead',
    company: 'Geekbot',
    period: 'Mar 2022 - Present',
    duration: '3 years',
    description: [
      'Drive technical strategy and architecture decisions for the Dashboard web application, delivering measurable improvements in performance, scalability, and maintainability',
      'Architected and maintain @geekbot/gui, a custom UI component library published to npm, enabling consistent design patterns across the organization',
      'Lead and mentor a team of engineers, fostering professional growth and ensuring high-quality technical delivery',
      'Established front-end best practices and standardized development workflows, creating scalable design systems that improve team productivity',
    ],
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'Geekbot',
    period: 'Sep 2018 - Feb 2022',
    duration: '3 years 5 months',
    description: [
      'Developed and optimized the company web application, focusing on performance improvements and user experience enhancements',
      'Implemented modern front-end architecture and development workflows, establishing patterns that improved team efficiency',
      'Collaborated closely with Product, Design, UX and QA teams to deliver features that met user needs and quality standards',
      'Maintained high code quality through systematic debugging, thorough code reviews, and adherence to best practices',
    ],
  },
  {
    id: 3,
    title: 'Junior Front-end Developer',
    company: 'Ordereze',
    period: 'Jan 2016 - Jan 2017',
    duration: '1 year',
    description: [
      'Developed and maintained user interfaces, implementing responsive designs and interactive features',
      'Refactored legacy code to improve maintainability and performance, reducing technical debt',
      'Collaborated with QA teams to identify, debug, and resolve issues, ensuring high-quality releases',
    ],
  },
  {
    id: 4,
    title: 'Web Developer Internship',
    company: 'Fedenet',
    period: 'Jul 2015 - Dec 2015',
    duration: '6 months',
    description: [
      'Built and customized client websites, implementing custom functionality and content management solutions',
      'Collaborated with senior developers to implement dynamic features and learn industry best practices',
      'Optimized website performance and responsiveness, improving load times and user experience across devices',
    ],
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

    // Animate border color
    const cardElement = card.querySelector('.experience-card');
    if (cardElement) {
      if (isHovering) {
        cardElement.classList.add('border-primary');
        cardElement.classList.remove('border-border');
      } else {
        cardElement.classList.remove('border-primary');
        cardElement.classList.add('border-border');
      }
    }
  };

  return (
    <section ref={sectionRef} id='experience' className='px-4 py-20'>
      <div className='mx-auto max-w-4xl'>
        <h2 className='mb-12 text-4xl font-bold md:text-5xl'>Experience</h2>
        <div className='relative'>
          {/* Vertical timeline line */}
          <div className='bg-border absolute top-0 bottom-0 left-0 w-0.5 md:left-1/2 md:-ml-px' />

          <div className='space-y-12'>
            {EXPERIENCES.map((exp, index) => (
              <div key={exp.id} className='relative'>
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
                  className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                  style={{ opacity: 0 }}
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                >
                  <Card className='experience-card border-border cursor-pointer p-6 transition-all hover:shadow-lg'>
                    <div className='mb-4 flex flex-col gap-2'>
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
                    <ul className='text-muted-foreground space-y-2'>
                      {exp.description.map((item, i) => (
                        <li key={i} className='flex items-start gap-2 leading-relaxed'>
                          <span className='text-2xl leading-none'>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
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
