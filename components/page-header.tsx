import type React from 'react';
import { FactItem } from '@/components/fact-item';
import { Eyebrow, Heading, Lede } from '@/components/ui/text';
import type { Fact } from '@/content/about';
import { cn } from '@/utils/cn';

type PageHeaderProps = {
  /** The page's name, in the dock's word for it. The dock shows only icons, so this is what says where you are. */
  eyebrow: string;
  title: string;
  /** One line under the title: what the page is, or who. */
  lede: React.ReactNode;
  /** A row of facts between two hairlines, after the actions. Each fact belongs to one page's header only. */
  facts?: Fact[];
  /** The page's actions: the channels, a button, the way back. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * The top of /cv and of /about: the same block in the same type on both, so moving between them changes the words
 * and nothing else. The title is set at the page size; the hero's bigger type belongs to the climb alone, which is
 * where the site makes its first impression. The page around it sets the width and what stands behind it.
 */
export function PageHeader({ eyebrow, title, lede, facts, children, className }: PageHeaderProps) {
  return (
    <header className={cn('max-wide:pt-[84px] pt-[92px] print:pt-0', className)}>
      {/* the page's name is for finding your way on screen; on paper the sheet is already the CV */}
      <Eyebrow className='print:hidden'>{eyebrow}</Eyebrow>
      {/* one line on wide screens: at 72px a name is a little wider than /cv's column, never than the screen */}
      <Heading
        as='h1'
        size='page'
        className='wide:whitespace-nowrap mt-2 print:mt-0 print:text-[34px]'
      >
        {title}
      </Heading>
      <Lede className='mt-3.5 print:mt-1.5 print:text-[16px]'>{lede}</Lede>
      {children && <div className='mt-7 print:mt-3'>{children}</div>}
      {facts && (
        <dl className='border-line max-wide:grid-cols-1 max-wide:gap-y-4 mt-10 grid grid-cols-3 gap-x-8 border-y py-6 print:mt-5 print:py-4'>
          {facts.map(fact => (
            <FactItem key={fact.label} fact={fact} />
          ))}
        </dl>
      )}
    </header>
  );
}
