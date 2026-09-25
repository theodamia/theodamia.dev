import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactRows } from '@/components/contact-rows';
import { ValleyStrip } from '@/components/scene/valley-strip';
import { SectionCard } from '@/components/section-card';
import { SocialLinks } from '@/components/social-links';
import { Timeline } from '@/components/timeline';
import { buttonVariants } from '@/components/ui/button';
import { Eyebrow, Heading } from '@/components/ui/text';
import { EDUCATION, SUMMARY_FACTS } from '@/content/about';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE } from '@/content/site';
import { bareUrl } from '@/utils/bare-url';

export const metadata: Metadata = pageMetadata({
  title: `Experience | ${SITE.name}`,
  description: 'Ten years of frontend work, newest first: every role, what it was and what I did.',
  path: '/cv',
});

/**
 * The same ten years the climb tells, read plainly: the facts a CV is scanned for, every job newest first, and how
 * to reach me. The mountain stays out of the way until the end, where the page arrives in the valley the climb
 * starts from — /about sits under the summit, so the two quiet pages hold opposite ends of the same world.
 */
export default function Cv() {
  return (
    <main className='bg-page relative min-h-screen print:min-h-0'>
      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7 print:px-0'>
        <header className='max-wide:pt-[84px] max-w-[720px] pt-[92px] print:pt-0'>
          <Eyebrow className='text-[17px]'>
            {SITE.title} · {SITE.location}
          </Eyebrow>
          <Heading as='h1' size='page' className='mt-2 print:text-[34px]'>
            {SITE.name}
          </Heading>
          <SocialLinks className='print:hidden' />
          {/* those tiles are three unreadable logos on paper, and contact belongs on sheet one: spell them out */}
          <p className='text-ink-2 mt-3 hidden text-[13.5px] leading-[1.7] print:block'>
            {[SITE.email, bareUrl(SITE.linkedin.url), bareUrl(SITE.github.url)].join(' · ')}
          </p>

          <dl className='border-line max-wide:grid-cols-1 max-wide:gap-y-4 mt-10 grid grid-cols-3 gap-x-8 border-y py-6 print:mt-5 print:py-4'>
            {SUMMARY_FACTS.map(fact => (
              <div key={fact.label}>
                <dt>
                  <Eyebrow>{fact.label}</Eyebrow>
                </dt>
                <dd className='text-ink mt-1 text-[16.5px] leading-[1.45] font-medium'>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* the years say the order on paper, and the climb is not somewhere a sheet of paper can go */}
          <p className='text-ink-3 mt-7 mb-12 text-[15px] print:hidden'>
            Newest first, back to the trailhead.{' '}
            <Link
              href='/'
              className='hover:text-ink font-semibold underline decoration-dotted underline-offset-4'
            >
              Or take the climb instead
            </Link>
          </p>
        </header>

        <Timeline />

        {/* where the degree goes on a CV: under the jobs. On screen it stays on /about, with the rest of the background */}
        {EDUCATION && (
          <section className='mt-10 hidden max-w-[720px] print:block'>
            <Heading as='h2' size='sub' className='print:text-[20px]'>
              {EDUCATION.label}
            </Heading>
            <p className='text-ink-2 mt-1 text-[15px]'>{EDUCATION.value}</p>
          </section>
        )}

        {/* on paper the header already carries all three channels: this card would only repeat them, with two
            buttons nobody can press and a location the facts row has said */}
        <SectionCard
          eyebrow='Contact'
          title='Putting a team together?'
          className='mx-0 mt-16 max-w-[720px] print:hidden'
        >
          <ContactRows />
        </SectionCard>
      </div>

      <ValleyStrip>
        <Link href='/' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
          <span aria-hidden='true'>←</span> Back to the climb
        </Link>
      </ValleyStrip>
    </main>
  );
}
