import { SocialLinks } from '@/components/social-links';
import { Eyebrow, Heading } from '@/components/ui/text';
import { SITE } from '@/lib/site';

export function Hero() {
  return (
    <section className='min-h-screen pt-[92px] max-[899px]:pt-[84px]'>
      <Eyebrow className='text-[17px]'>
        {SITE.title} · {SITE.location}
      </Eyebrow>
      <Heading as='h1' size='hero' className='mt-3 max-w-[640px]'>
        {SITE.name}
      </Heading>
      <p className='text-ink-2 mt-[18px] max-w-[480px] text-[19px] text-pretty max-[899px]:max-w-full max-[899px]:text-[18px]'>
        Ten years of frontend work, drawn as one long climb. Every stop on the trail is a job, and
        the summit is still ahead.
      </p>
      <SocialLinks />
    </section>
  );
}
