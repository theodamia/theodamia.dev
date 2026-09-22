import type React from 'react';
import { Eyebrow, Heading } from '@/components/ui/text';
import { cn } from '@/utils/cn';

type SectionCardProps = {
  id?: string;
  eyebrow: string;
  title: string;
  className?: string;
  children: React.ReactNode;
};

/** The big white reading surface every piece of general information sits on. */
export function SectionCard({ id, eyebrow, title, className, children }: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        // w-full: an auto margin in the page's flex column would otherwise shrink the card to its content
        'rounded-section border-line bg-card shadow-card max-wide:rounded-[22px] max-wide:px-[22px] max-wide:pt-[30px] max-wide:pb-8 mx-auto w-full max-w-[980px] border px-[52px] pt-12 pb-[52px]',
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading className='mt-1.5'>{title}</Heading>
      {children}
    </section>
  );
}
