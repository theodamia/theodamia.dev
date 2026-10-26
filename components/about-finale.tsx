import type React from 'react';
import { ContactRows } from '@/components/contact-rows';
import { ContactSignal } from '@/components/contact-signal';
import { AboutDawn } from '@/components/scene/about-dawn';
import { TrailLink } from '@/components/trail-link';
import { Eyebrow, Heading } from '@/components/ui/text';
import { CONTACT_INVITATION } from '@/content/about';
import { CLOUD_LINE, RANGE_ASPECT, RANGE_RISE } from '@/scene/about';

const QUIET_LINK = 'hover:text-ink font-semibold underline decoration-dotted underline-offset-4';

/**
 * Contact, the page's last screen. A short band takes the page into the sky; then one screen: the card near the
 * top, a band of open sky (where the easter egg plays), and the range along the bottom edge, its summit's height
 * kept free for it. The range spans the screen's width, so how tall it stands is a share of that width (`cqw`,
 * against the finale as the container), measured on the painting (scene/about.ts). Nothing is pinned: at the
 * page's end the card simply stops near the top. On phones it is just the card.
 */
export function AboutFinale() {
  return (
    <>
      <div aria-hidden='true' className='about-into max-wide:hidden print:hidden' />
      <section
        id='contact'
        aria-labelledby='contact-title'
        data-finale
        className='about-finale'
        style={
          {
            '--about-rise': `${(RANGE_RISE * 100).toFixed(3)}cqw`,
            '--about-cloud-depth': `${((CLOUD_LINE / RANGE_ASPECT) * 100).toFixed(3)}cqw`,
          } as React.CSSProperties
        }
      >
        <AboutDawn />
        <div className='max-wide:px-4 relative mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-7'>
          <div className='rounded-section border-line bg-card shadow-card wide:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] max-wide:rounded-[22px] grid w-full max-w-[1000px] items-start gap-x-11 gap-y-7 border p-[clamp(24px,2.8vw,40px)]'>
            <div>
              <Eyebrow>Contact</Eyebrow>
              <Heading
                id='contact-title'
                className='mt-1.5 text-[clamp(30px,3vw,42px)] leading-[1.04] tracking-[-0.025em] text-balance'
              >
                Putting a team together?
              </Heading>
              <p className='text-ink-2 mt-3.5 max-w-[40ch] text-[16.5px] leading-[1.5] text-pretty'>
                {CONTACT_INVITATION}
              </p>
              <p className='text-ink-3 mt-[22px] text-[15px] print:hidden'>
                <TrailLink href='/' className={QUIET_LINK}>
                  <span aria-hidden='true'>←</span> Back to the climb
                </TrailLink>
              </p>
            </div>
            <ContactRows className='mt-0' />
          </div>
          <div aria-hidden='true' className='about-band max-wide:hidden' />
          <div aria-hidden='true' className='about-foot max-wide:hidden' />
        </div>
        <ContactSignal />
      </section>
    </>
  );
}
