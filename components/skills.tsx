'use client';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Code2, Palette, Database, Wrench, Users } from 'lucide-react';

const SKILLS = [
  {
    name: 'Core Frontend',
    icon: Code2,
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Redux',
      'React Router',
      'Mantine UI',
      'Shadcn UI',
      'Apollo Client',
      'Storybook',
    ],
    animationType: 'code',
  },
  {
    name: 'Styling & Design',
    icon: Palette,
    skills: ['Tailwind CSS', 'PostCSS', 'UI/UX', 'Atomic Design', 'BEM'],
    animationType: 'style',
  },
  {
    name: 'Backend & APIs',
    icon: Database,
    skills: ['GraphQL', 'REST APIs', 'Node.js', 'WebSockets', 'Prisma'],
    animationType: 'data',
  },
  {
    name: 'Tools & Workflow',
    icon: Wrench,
    skills: [
      'Git',
      'Webpack',
      'Vite',
      'Docker',
      'Testing',
      'CI/CD',
      'Semantic Versioning',
      'Cursor',
      'Zeplin',
    ],
    animationType: 'tools',
  },
  {
    name: 'Leadership',
    icon: Users,
    skills: [
      'Team Leadership',
      'Mentoring',
      'Code Reviews',
      'Architecture',
      'Project Management',
      'Feedback',
    ],
    animationType: 'leadership',
  },
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<(HTMLDivElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const activeAnimations = useRef<anime.AnimeInstance[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            anime({
              targets: categoriesRef.current.filter(Boolean),
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 600,
              delay: anime.stagger(100),
              easing: 'easeOutCubic',
            });
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

  const handleMouseEnter = (index: number) => {
    const icon = iconsRef.current[index];
    if (!icon) return;

    const category = SKILLS[index];
    let animation: anime.AnimeInstance;

    if (category.animationType === 'code') {
      animation = anime({
        targets: icon,
        translateY: [-2, 2],
        duration: 400,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
      });
    } else if (category.animationType === 'style') {
      animation = anime({
        targets: icon,
        rotate: [-5, 5],
        scale: [1, 1.05, 1],
        duration: 800,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
      });
    } else if (category.animationType === 'data') {
      animation = anime({
        targets: icon,
        scale: [1, 1.08, 1],
        duration: 600,
        loop: true,
        easing: 'easeInOutQuad',
      });
    } else if (category.animationType === 'tools') {
      animation = anime({
        targets: icon,
        rotate: [-4, 4, -4, 4, 0],
        duration: 600,
        loop: true,
        easing: 'easeInOutSine',
      });
    } else if (category.animationType === 'leadership') {
      animation = anime({
        targets: icon,
        translateY: [-2, 2],
        scale: [1, 1.04, 1],
        duration: 800,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad',
      });
    }

    activeAnimations.current[index] = animation!;
  };

  const handleMouseLeave = (index: number) => {
    const animation = activeAnimations.current[index];
    const icon = iconsRef.current[index];

    if (animation) {
      animation.pause();
    }

    if (icon) {
      anime({
        targets: icon,
        translateY: 0,
        rotate: 0,
        scale: 1,
        duration: 150,
        easing: 'easeOutQuad',
      });
    }
  };

  return (
    <section ref={sectionRef} id='skills' className='bg-muted/30 px-4 py-20'>
      <div className='container mx-auto max-w-6xl'>
        <h2 className='mb-12 text-4xl font-bold md:text-5xl'>Skills & Expertise</h2>

        <div className='flex flex-wrap justify-center gap-6'>
          {SKILLS.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                ref={el => {
                  categoriesRef.current[index] = el;
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className='border-border/50 bg-card/50 hover:border-primary hover:shadow-primary/5 w-full rounded-lg border p-5 opacity-0 transition-all duration-300 hover:shadow-lg md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]'
              >
                <div className='mb-4 flex items-center gap-3'>
                  <div
                    ref={el => {
                      iconsRef.current[index] = el;
                    }}
                    className='bg-primary/10 rounded-md p-2'
                  >
                    <Icon className='text-primary h-5 w-5 shrink-0' />
                  </div>
                  <h3 className='text-foreground text-lg font-semibold'>{category.name}</h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {category.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant='secondary' className='text-sm'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
