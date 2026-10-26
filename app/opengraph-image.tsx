import { OG_SIZE, shareCard } from '@/lib/og/card';
import { SITE } from '@/content/site';

export const alt = `${SITE.name} · ${SITE.title}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

/**
 * The card a pasted link shows in LinkedIn or Slack, for every page but /ai: who this is, over the dawn and the
 * next range at sunrise, the painting /about ends on (lib/og/card.tsx). Drawn from `content/site.ts` at build, so it
 * cannot fall out of step with the site.
 */
export default function Image() {
  return shareCard({
    background: 'card-site.jpg',
    eyebrow: `${SITE.title} · ${SITE.location}`,
    title: SITE.name,
    line: 'Ten years of software engineering, drawn as one long climb.',
    measure: 1000,
    titleSize: 96,
  });
}
