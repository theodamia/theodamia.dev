import type React from 'react';
import { Heading } from '@/components/ui/text';

type PageSectionProps = {
  id: string;
  /** The section's name, in the margin on wide screens: where the reader is, while they read it. */
  name: string;
  title: string;
  children: React.ReactNode;
};

/**
 * One section of a reading page (/about, /ai), open on the page: its name in a margin that stays in view while the
 * section is read (wayfinding, so the heading does not need a label above it), and its heading and content beside
 * it. Hairlines between sections, as on /cv. On phones the name sits above the heading.
 */
export function PageSection({ id, name, title, children }: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className='border-line wide:grid-cols-[180px_minmax(0,1fr)] max-wide:py-12 grid gap-x-12 border-b py-[clamp(72px,9vw,128px)] last:border-b-0'
    >
      <p className='text-ink-3 wide:sticky wide:top-7 wide:self-start wide:pt-2.5 max-wide:pb-2.5 text-[15px] font-semibold'>
        {name}
      </p>
      <div className='min-w-0'>
        <Heading id={`${id}-title`} className='max-w-[18ch] text-balance'>
          {title}
        </Heading>
        {children}
      </div>
    </section>
  );
}
