import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE } from '@/content/site';

export const alt = `${SITE.name} · ${SITE.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The card a recruiter sees when the link is pasted into LinkedIn, Slack or a mail client — for most of them it is
 * the first thing they see of this site, so it says the same four facts the hero does over the same dawn and the
 * same green hills. Drawn here rather than exported by hand, so it can never fall out of step with `content/site.ts`.
 *
 * Satori (what `ImageResponse` draws with) is not a browser: no `oklch`, no CSS variables, no `clip-path`, and
 * every box with more than one child needs an explicit `display: flex`. Hence the plain hex below, close to the
 * tokens in `globals.css`, and the hills as one `<svg>`. The fonts are committed under `lib/og/fonts` (OFL) so a
 * build never has to reach the network for them.
 */
const FONT_DIR = join(process.cwd(), 'lib/og/fonts');

/* the interface tokens, as Satori can read them */
const INK = '#1e2b37';
const INK_2 = '#465868';
const ACCENT = '#cf4318';

export default async function Image() {
  const [display, text] = await Promise.all([
    readFile(join(FONT_DIR, 'bricolage-700.ttf')),
    readFile(join(FONT_DIR, 'instrument-500.ttf')),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 84px',
        backgroundImage: 'linear-gradient(180deg, #dde3f1 0%, #eee7dc 58%, #f6f2e9 100%)',
        fontFamily: 'Instrument Sans',
      }}
    >
      {/* the hills, sitting on the bottom edge the way the trailhead does on the page */}
      <svg
        width='1200'
        height='300'
        viewBox='0 0 1200 300'
        style={{ position: 'absolute', bottom: 0, left: 0 }}
      >
        <path d='M0 300 L250 96 L470 300 Z' fill='#b9cdc0' />
        <path d='M760 300 L980 122 L1200 300 Z' fill='#b9cdc0' />
        <path d='M330 300 L620 60 L910 300 Z' fill='#93b4a1' />
        <path
          d='M0 300 L0 236 C170 206 330 252 520 240 C760 224 930 190 1200 224 L1200 300 Z'
          fill='#6f9781'
        />
        {/* the trail, dotted the way it is on the page, climbing to a summit the card does not quite show */}
        <path
          d='M470 300 C 530 258 566 226 592 168 C 606 136 612 104 620 72'
          fill='none'
          stroke='#f6f2e9'
          strokeWidth='5'
          strokeDasharray='2 15'
          strokeLinecap='round'
        />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', fontSize: 27, color: INK_2, letterSpacing: '0.01em' }}>
          {SITE.title} · {SITE.location}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Bricolage Grotesque',
            fontSize: 96,
            lineHeight: 1,
            color: INK,
            letterSpacing: '-0.025em',
            marginTop: 18,
          }}
        >
          {SITE.name}
        </div>
        <div style={{ display: 'flex', fontSize: 31, color: INK_2, marginTop: 26 }}>
          Ten years of frontend work, drawn as one long climb.
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 40,
            fontSize: 25,
            color: ACCENT,
            letterSpacing: '0.02em',
          }}
        >
          theodamia.dev
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Bricolage Grotesque', data: display, weight: 700, style: 'normal' },
        { name: 'Instrument Sans', data: text, weight: 500, style: 'normal' },
      ],
    }
  );
}
