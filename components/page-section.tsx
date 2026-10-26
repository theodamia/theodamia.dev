import type React from 'react';
import { Eyebrow, Heading } from '@/components/ui/text';

type PageSectionProps = {
  id: string;
  /** The section's name in plain words, above its title: where the reader is ("Skills"), when the title is a phrase. */
  name: string;
  title: string;
  children: React.ReactNode;
};

/**
 * One section of a reading page (/about, /ai): its name and title together in a margin that stays in view while the
 * section is read, and its content beside them from the first line. A title alone on a row above its content took
 * the most space and said the least; in the margin it does the wayfinding and the content starts at once. Hairlines
 * between sections, as on /cv. On phones the name and title sit above the content.
 */
export function PageSection({ id, name, title, children }: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className='border-line wide:grid-cols-[260px_minmax(0,1fr)] max-wide:py-11 grid gap-x-14 border-b py-[clamp(56px,7vw,96px)] last:border-b-0'
    >
      <div className='wide:sticky wide:top-7 wide:self-start max-wide:pb-6'>
        <Eyebrow>{name}</Eyebrow>
        <Heading id={`${id}-title`} size='card' className='mt-1.5 text-balance'>
          {title}
        </Heading>
      </div>
      <div className='min-w-0'>{children}</div>
    </section>
  );
}
