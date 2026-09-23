import { GitHubIcon, GmailIcon, LinkedInIcon } from '@/components/icons/brand-icon';
import { SITE } from '@/lib/site';
import { cn } from '@/utils/cn';

const LINKS = [
  { label: 'LinkedIn', href: SITE.linkedin.url, Icon: LinkedInIcon, external: true },
  { label: 'GitHub', href: SITE.github.url, Icon: GitHubIcon, external: true },
  { label: `Email ${SITE.email}`, href: `mailto:${SITE.email}`, Icon: GmailIcon, external: false },
];

/** Three white tiles, one glyph each. The glyph turns to the accent on hover. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('mt-7 flex flex-wrap gap-2.5', className)}>
      {LINKS.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className='rounded-tile border-line bg-card shadow-soft text-ink hover:border-ink hover:text-accent ease-soft inline-flex size-[52px] items-center justify-center border transition-[translate,border-color,color] duration-[180ms] hover:-translate-y-0.5 motion-reduce:transition-none'
          >
            <Icon />
            {external && <span className='sr-only'>(opens in a new tab)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
