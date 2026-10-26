import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ForkScene } from '@/components/scene/fork-scene';
import { TrailLink } from '@/components/trail-link';
import { buttonVariants, quietLinkVariants } from '@/components/ui/button';
import { SITE } from '@/content/site';

export const metadata: Metadata = {
  title: `Not found | ${SITE.name}`,
};

/** The ways on from a lost trail: the climb first, then every other page, by the dock's names. */
const OTHER_PAGES = [
  { href: '/cv', label: 'Experience' },
  { href: '/about', label: 'About' },
  { href: '/ai', label: 'Working with AI' },
];

/**
 * A page that is not there. The reader has lost the trail, so the page stands where /ai ends: the giant at a fork,
 * waiting, and the ways on are links, the climb first. The same header every reading page opens on, in plain words:
 * what happened, and where to go.
 */
export default function NotFound() {
  return (
    <main className='bg-page relative'>
      <ForkScene>
        <PageHeader
          eyebrow='Not found'
          title='This trail isn’t on the map'
          lede='The page may have moved, or the address has a typo. Every page of the site is a step away.'
          className='pt-0'
        >
          <div className='flex flex-wrap items-center gap-x-[22px] gap-y-4'>
            <TrailLink href='/' className={buttonVariants({ size: 'sm' })}>
              Back to the climb
            </TrailLink>
            {OTHER_PAGES.map(page => (
              <TrailLink
                key={page.href}
                href={page.href}
                className={quietLinkVariants({ standalone: true })}
              >
                {page.label}
              </TrailLink>
            ))}
          </div>
        </PageHeader>
      </ForkScene>
    </main>
  );
}
