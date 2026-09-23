import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactRows } from '@/components/contact-rows';
import { SectionCard } from '@/components/section-card';
import { SocialLinks } from '@/components/social-links';
import { Timeline } from '@/components/timeline';
import { buttonVariants } from '@/components/ui/button';
import { Eyebrow, Heading } from '@/components/ui/text';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Experience | ${SITE.name}`,
  description: 'Ten years of frontend work, newest first: every role, what it was and what I did.',
};

/**
 * The same ten years the climb tells, read plainly: every job newest first, then how to reach me. No mountain
 * here on purpose — this is the page for someone who wants the facts, and the scene would be arguing with them.
 */
export default function Cv() {
  return (
    <main className='bg-page relative min-h-screen'>
      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <header className='max-wide:pt-[84px] pt-[92px] pb-10'>
          <Eyebrow className='text-[17px]'>
            {SITE.title} · {SITE.location}
          </Eyebrow>
          <Heading as='h1' size='page' className='mt-2'>
            {SITE.name}
          </Heading>
          <SocialLinks />
          <p className='text-ink-3 mt-9 text-[15px]'>
            Ten years, newest first.{' '}
            <Link
              href='/'
              className='hover:text-ink font-semibold underline decoration-dotted underline-offset-4'
            >
              Or take the climb instead
            </Link>
          </p>
        </header>

        <Timeline />

        <SectionCard
          eyebrow='Contact'
          title='Putting a team together?'
          className='mx-0 max-w-[720px]'
        >
          <ContactRows />
        </SectionCard>

        <footer className='pt-14 pb-[130px] text-center'>
          <Link href='/' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
            <span aria-hidden='true'>←</span> Back to the climb
          </Link>
        </footer>
      </div>
    </main>
  );
}
