import { SocialLinks } from '@/components/social-links';
import { Eyebrow, Heading, Lede } from '@/components/ui/text';
import { SITE } from '@/lib/site';

/** The top of the climb page: who this is, what the page is, and the three ways to reach me. */
export function Hero() {
  /* the first screen belongs to the mountain; the timeline has no use for it and starts right after the name */
  return (
    <section className='max-wide:pt-[84px] timeline:min-h-0 timeline:pb-4 min-h-screen pt-[92px]'>
      <Eyebrow className='text-[17px]'>
        {SITE.title} · {SITE.location}
      </Eyebrow>
      <Heading as='h1' size='hero' className='mt-3 max-w-[640px]'>
        {SITE.name}
      </Heading>
      <Lede>
        Ten years of frontend work, drawn as one long climb. Every stop on the trail is a job, and
        the summit is still ahead.
      </Lede>
      <SocialLinks />
    </section>
  );
}
