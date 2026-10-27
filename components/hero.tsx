import { TrailLink } from '@/components/trail-link';
import { SocialLinks } from '@/components/social-links';
import { quietLinkVariants } from '@/components/ui/button';
import { Eyebrow, Heading, Lede } from '@/components/ui/text';
import { SITE } from '@/content/site';

/**
 * The top of the climb page: who this is, what the page is, and the three ways to reach me.
 *
 * The words float over the painted meadow and the path, so they wear the scene's text halo, as the altimeter's
 * labels do, and sit on a wash of the page colour (`.hero-wash`): a soft one beside the scene on wide screens, a
 * scrim on phones, where the village is right under the lede. A wider halo would read as a cloud instead.
 */
export function Hero() {
  return (
    <section className='hero-wash max-wide:pt-[84px] text-shadow-halo min-h-screen pt-[92px]'>
      <Eyebrow className='text-[17px]'>
        {SITE.title} · {SITE.location}
      </Eyebrow>
      <Heading as='h1' size='hero' className='mt-3 max-w-[640px]'>
        {SITE.name}
      </Heading>
      <Lede>
        Ten years of software engineering, from the interface to the database. A camp for every
        role, a&nbsp;lesson&nbsp;from&nbsp;every&nbsp;camp, and the summit still ahead.
      </Lede>
      <SocialLinks />
      {/*
       * A signpost, not an apology: the climb is worth the time it asks for, but the reader who has ninety seconds
       * and a shortlist should not have to find the way out behind an icon. The same quiet dotted line that points
       * back here from /cv, pointing the other way.
       */}
      <p className='mt-6'>
        <TrailLink href='/cv' className={quietLinkVariants({ standalone: true })}>
          Every role, on one page
        </TrailLink>
      </p>
    </section>
  );
}
