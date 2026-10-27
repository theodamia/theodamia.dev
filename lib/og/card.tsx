import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/** A share card's size: what LinkedIn, Slack and X crop to. */
export const OG_SIZE = { width: 1200, height: 630 };

/** Committed rather than fetched (OFL), so a build never reaches the network for them. */
const OG_DIR = join(process.cwd(), 'lib/og');

/* the interface tokens, as Satori can read them */
const INK = '#1e2b37';
const INK_2 = '#465868';
const ACCENT = '#cf4318';

type Card = {
  /** The painted background in lib/og/, composed by `pnpm og` (scripts/process-og.mjs). */
  background: 'card-site.jpg' | 'card-ai.jpg';
  /** The small line above the title. */
  eyebrow: string;
  title: string;
  /** One line under the title. */
  line: string;
  /** How wide the words may run, in px: narrower where a painting stands beside them. */
  measure: number;
  /** The title's size in px: the name is short and set large, a sentence a step down. */
  titleSize: number;
};

/**
 * A share card: the words over one of the site's paintings in its sky. Satori is not a browser — no `oklch`, no
 * CSS variables, no WebP, and every box with more than one child needs an explicit `display: flex` — so the
 * background is a JPEG composed beforehand from the paintings and the tokens, and the colours here are plain hex.
 */
export async function shareCard({ background, eyebrow, title, line, measure, titleSize }: Card) {
  const [display, text, picture] = await Promise.all([
    readFile(join(OG_DIR, 'fonts/bricolage-700.ttf')),
    readFile(join(OG_DIR, 'fonts/instrument-500.ttf')),
    readFile(join(OG_DIR, background)),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '84px 84px 0',
        fontFamily: 'Instrument Sans',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws an <img>, there is no next/image here */}
      <img
        alt=''
        src={`data:image/jpeg;base64,${picture.toString('base64')}`}
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: measure }}>
        <div style={{ display: 'flex', fontSize: 26, color: INK_2, letterSpacing: '0.01em' }}>
          {eyebrow}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Bricolage Grotesque',
            fontSize: titleSize,
            lineHeight: 1.02,
            color: INK,
            letterSpacing: '-0.025em',
            marginTop: 16,
          }}
        >
          {title}
        </div>
        <div
          style={{ display: 'flex', fontSize: 30, lineHeight: 1.3, color: INK_2, marginTop: 24 }}
        >
          {line}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 30,
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
      ...OG_SIZE,
      fonts: [
        { name: 'Bricolage Grotesque', data: display, weight: 700, style: 'normal' },
        { name: 'Instrument Sans', data: text, weight: 500, style: 'normal' },
      ],
    }
  );
}
