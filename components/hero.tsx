import Link from 'next/link';
import { SocialLinks } from '@/components/social-links';
import { Eyebrow, Heading, Lede } from '@/components/ui/text';
import { SITE } from '@/content/site';

/** The top of the climb page: who this is, what the page is, and the three ways to reach me. */
export function Hero() {
  return (
    <section className='max-wide:pt-[84px] min-h-screen pt-[92px]'>
      <Eyebrow className='text-[17px]'>
        {SITE.title} · {SITE.location}
      </Eyebrow>
      <Heading as='h1' size='hero' className='mt-3 max-w-[640px]'>
        {SITE.name}
      </Heading>
      <Lede>
        Ten years of frontend work, drawn as one long climb: a camp for every job and the summit
        still ahead.
      </Lede>
      <SocialLinks />
      {/*
       * A signpost, not an apology: the climb is worth the time it asks for, but the reader who has ninety seconds
       * and a shortlist should not have to find the way out behind an icon. The same quiet dotted line that points
       * back here from /cv, pointing the other way.
       */}
      <p className='mt-6'>
        <Link
          href='/cv'
          className='text-ink-3 hover:text-ink text-[15px] font-semibold underline decoration-dotted underline-offset-4'
        >
          Every role, on one page
        </Link>
      </p>
    </section>
  );
}
