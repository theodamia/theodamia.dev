import { GitHubIcon, GmailIcon, LinkedInIcon } from '@/components/icons/brand-icon';
import { SITE } from '@/content/site';
import { cn } from '@/utils/cn';

const LINKS = [
  { label: 'LinkedIn', href: SITE.linkedin.url, Icon: LinkedInIcon, external: true },
  { label: 'GitHub', href: SITE.github.url, Icon: GitHubIcon, external: true },
  { label: `Email ${SITE.email}`, href: `mailto:${SITE.email}`, Icon: GmailIcon, external: false },
];

/**
 * Three white tiles, one glyph each. The glyph turns to the accent on hover.
 *
 * The new-tab warning is part of `aria-label`, not an `sr-only` span inside the link. These tiles have no visible
 * text, so the label has to carry the name — and `aria-label` *replaces* an element's contents when a screen
 * reader works out its name, which would leave such a span announced by nobody. Elsewhere (`job-card`,
 * `contact-rows`) the link has real text and no `aria-label`, so there the span is read and belongs.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('mt-7 flex flex-wrap gap-2.5', className)}>
      {LINKS.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={external ? `${label} (opens in a new tab)` : label}
            title={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className='rounded-tile border-line bg-card shadow-soft text-ink hover:border-ink hover:text-accent ease-soft inline-flex size-[52px] items-center justify-center border transition-[translate,border-color,color] duration-[180ms] hover:-translate-y-0.5 motion-reduce:transition-none'
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
