import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CopyEmailButton } from '@/components/copy-email-button';
import { GitHubIcon, GmailIcon, LinkedInIcon } from '@/components/icons/brand-icon';
import { buttonVariants } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/text';
import { SITE } from '@/lib/site';
import { cn } from '@/utils/cn';

const ARROW_SIZE = 18;
/** The logo sits on the label's line, at its size. */
const LOGO_SIZE = 16;
const LABEL = 'flex items-center gap-1.5';
const TILE = 'rounded-inner border-line bg-tint text-ink border';

const PROFILES = [
  { label: 'LinkedIn', value: SITE.linkedin.handle, href: SITE.linkedin.url, Icon: LinkedInIcon },
  { label: 'GitHub', value: SITE.github.handle, href: SITE.github.url, Icon: GitHubIcon },
];

/** Where and when: the quiet line under the channels. */
const WHEREABOUTS = [SITE.location, 'Remote', 'UTC+2/+3'];

/**
 * Email first, the one channel that needs no account: a full-width row with the address and its two actions,
 * copy it or write straight away. The two profiles sit side by side below it, whole tiles as links; their logo
 * turns to the accent on hover, as in the hero.
 */
export function ContactRows() {
  return (
    <div className='mt-[26px]'>
      <ul className='grid grid-cols-2 gap-3 max-[899px]:grid-cols-1'>
        <li
          className={cn(
            TILE,
            'col-span-2 flex items-center gap-x-4 gap-y-3.5 px-5 py-4 max-[899px]:col-span-1 max-[899px]:flex-wrap max-[899px]:px-4'
          )}
        >
          <div className='min-w-0 flex-1 text-[20px] font-semibold break-words max-[899px]:text-[17px]'>
            <Eyebrow className={LABEL}>
              <GmailIcon width={LOGO_SIZE} height={LOGO_SIZE} className='shrink-0' />
              Email
            </Eyebrow>
            {SITE.email}
          </div>
          <div className='flex shrink-0 gap-2 max-[899px]:w-full'>
            <CopyEmailButton email={SITE.email} className='whitespace-nowrap' />
            <a
              href={`mailto:${SITE.email}`}
              className={cn(buttonVariants({ size: 'sm' }), 'whitespace-nowrap max-[899px]:flex-1')}
            >
              Email me
              <ArrowRight size={ARROW_SIZE} aria-hidden='true' />
            </a>
          </div>
        </li>
        {PROFILES.map(({ label, value, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                TILE,
                'group hover:border-ink ease-soft grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-4 font-semibold transition-[border-color,transform,translate] duration-[180ms] hover:-translate-y-0.5 motion-reduce:transition-none max-[899px]:px-4'
              )}
            >
              <div className='min-w-0 break-words max-[899px]:text-base'>
                <Eyebrow className={LABEL}>
                  <Icon
                    width={LOGO_SIZE}
                    height={LOGO_SIZE}
                    className='group-hover:text-accent shrink-0 transition-colors duration-[180ms] motion-reduce:transition-none'
                  />
                  {label}
                </Eyebrow>
                {value}
              </div>
              <ArrowUpRight
                size={ARROW_SIZE}
                aria-hidden='true'
                className='text-ink-3 group-hover:text-ink transition-colors duration-[180ms] motion-reduce:transition-none'
              />
            </a>
          </li>
        ))}
      </ul>
      <p className='text-ink-3 mt-4 text-[15px]'>{WHEREABOUTS.join(' · ')}</p>
    </div>
  );
}
