import { OG_SIZE, shareCard } from '@/lib/og/card';
import { AI_PAGE } from '@/content/ai';
import { SITE } from '@/content/site';

export const alt = `${AI_PAGE.title} · ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

/**
 * /ai's own card, since it is the page sent to the reader weighing me for a team bringing AI in: its title over
 * the giant looking at its half-drafted range, the painting the page opens on (lib/og/card.tsx).
 */
export default function Image() {
  return shareCard({
    background: 'card-ai.jpg',
    eyebrow: `${SITE.name} · ${AI_PAGE.eyebrow}`,
    title: AI_PAGE.title,
    line: 'AI enablement for software teams.',
    measure: 560,
    titleSize: 68,
  });
}
