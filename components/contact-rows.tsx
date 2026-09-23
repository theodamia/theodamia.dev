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
 * and their arrow turn to the accent on hover, as in the hero.
 */
export function ContactRows() {
  return (
    <div className='mt-[26px]'>
      <ul className='max-wide:grid-cols-1 grid grid-cols-2 gap-3'>
        <li
          className={cn(
            TILE,
            'max-wide:col-span-1 max-wide:flex-wrap max-wide:px-4 col-span-2 flex items-center gap-x-4 gap-y-3.5 px-5 py-4'
          )}
        >
          <div className='max-wide:text-[17px] min-w-0 flex-1 text-[20px] font-semibold break-words'>
            <Eyebrow className={LABEL}>
              <GmailIcon width={LOGO_SIZE} height={LOGO_SIZE} className='shrink-0' />
              Email
            </Eyebrow>
            {SITE.email}
          </div>
          <div className='max-wide:w-full flex shrink-0 gap-2'>
            <CopyEmailButton email={SITE.email} className='whitespace-nowrap' />
            <a
              href={`mailto:${SITE.email}`}
              className={cn(buttonVariants({ size: 'sm' }), 'max-wide:flex-1 whitespace-nowrap')}
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
                'group hover:border-ink ease-soft max-wide:px-4 grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-4 font-semibold transition-[border-color,translate] duration-[180ms] hover:-translate-y-0.5 motion-reduce:transition-none'
              )}
            >
              <div className='max-wide:text-base min-w-0 break-words'>
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
              <span className='sr-only'>(opens in a new tab)</span>
              <ArrowUpRight
                size={ARROW_SIZE}
                aria-hidden='true'
                className='text-ink-3 group-hover:text-accent transition-colors duration-[180ms] motion-reduce:transition-none'
              />
            </a>
          </li>
        ))}
      </ul>
      <p className='text-ink-3 mt-4 text-[15px]'>{WHEREABOUTS.join(' · ')}</p>
    </div>
  );
}
