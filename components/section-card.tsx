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
        'rounded-section border-line bg-card shadow-card mx-auto max-w-[980px] border px-[52px] pt-12 pb-[52px] max-[899px]:rounded-[22px] max-[899px]:px-[22px] max-[899px]:pt-[30px] max-[899px]:pb-8',
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading className='mt-1.5'>{title}</Heading>
      {children}
    </section>
  );
}
