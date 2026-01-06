'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            if (titleRef.current) {
              anime({
                targets: titleRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'cubicBezier(0.22, 1, 0.36, 1)',
              });
            }

            if (cardRef.current) {
              anime({
                targets: cardRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: 150,
                easing: 'cubicBezier(0.22, 1, 0.36, 1)',
              });
            }

            if (footerRef.current) {
              anime({
                targets: footerRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: 300,
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
    <section ref={sectionRef} id='contact' className='flex min-h-screen items-center px-4 py-20'>
      <div className='mx-auto w-full max-w-4xl'>
        <h2 ref={titleRef} className='mb-12 text-4xl font-bold md:text-5xl' style={{ opacity: 0 }}>
          Get In Touch
        </h2>
        <div ref={cardRef} style={{ opacity: 0 }}>
          <Card className='p-8'>
            <p className='text-muted-foreground mb-8 text-lg leading-relaxed text-balance'>
              I'm always interested in hearing about new opportunities, collaborations, or just
              connecting with fellow developers. Feel free to reach out through any of the platforms
              below.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button asChild size='lg' className='flex-1'>
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
              <Button asChild variant='outline' size='lg' className='flex-1 bg-transparent'>
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
              <Button asChild variant='outline' size='lg' className='flex-1 bg-transparent'>
                <a href='mailto:theodamia@gmail.com' className='gap-2'>
                  <Mail className='h-5 w-5' />
                  Email
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
