import type React from 'react';
import { BACKDROP_TILES, flagLayout, FOOT_END, maxScale, type BoxShare } from '@/scene/camera';
import { artUrl, FLAG, type Flat, type FlatArt, type Theme } from '@/scene/flats';

const THEMES: Theme[] = ['day', 'night'];

/** A rectangle given in shares of the flat's box, as inline style. */
const placed = ({ left, top, width, height }: BoxShare): React.CSSProperties => ({
  left: `${left.toFixed(3)}%`,
  top: `${top.toFixed(3)}%`,
  width: `${width.toFixed(3)}%`,
  height: `${height.toFixed(3)}%`,
});

/**
 * One painting in both themes. No `src`: `lib/scene-art.ts` picks the desktop or phone file once and decodes it
 * before CSS shows it. A phone's near file covers only the middle of the box, so it says where it goes.
 */
function Paintings({
  art,
  lod,
  phoneShare,
}: {
  art: Record<Theme, FlatArt>;
  lod: 'near' | 'far';
  phoneShare?: BoxShare;
}) {
  const phone: React.CSSProperties | undefined = phoneShare && {
    ['--phone-left' as string]: `${phoneShare.left.toFixed(3)}%`,
    ['--phone-width' as string]: `${phoneShare.width.toFixed(3)}%`,
  };

  return THEMES.map(theme => {
    const file = lod === 'near' ? art[theme].near : art[theme].far;
    const phoneFile = lod === 'near' ? art[theme].nearPhone : art[theme].farPhone;
    if (!file) return null;

    return (
      <img
        key={theme}
        alt=''
        data-art={theme}
        data-src={artUrl(file)}
        data-src-phone={phoneFile ? artUrl(phoneFile) : undefined}
        decoding='async'
        draggable={false}
        style={lod === 'near' ? phone : undefined}
      />
    );
  });
}

/**
 * The backdrop, laid as copies a period apart over a haze fill. Each copy is its own wrapper, so the theme
 * fallback in CSS judges each copy's day and night pictures on their own; its pictures are the period plus its
 * bleed, wider than the period by the same share in both files, and later copies lie over earlier ones' bleed.
 * All copies share one URL: one download, one decode. The fill starts where the painting's foot dissolves and runs
 * past the bottom of any screen, so a tall screen ends in haze, never in sky.
 */
function Tiles({ flat }: { flat: Flat }) {
  const { tile, foot = 0, box } = flat;
  if (!tile) return null;
  const [, y, , height] = box;
  const first = BACKDROP_TILES[0];

  return (
    <>
      <div
        className='scene-foot'
        style={{
          left: `${first * 100}%`,
          width: `${BACKDROP_TILES.length * 100}%`,
          top: `${(((foot - y) / height) * 100).toFixed(3)}%`,
          height: `${(((FOOT_END - foot) / height) * 100).toFixed(3)}%`,
        }}
      />
      {BACKDROP_TILES.map(k => (
        <div
          key={k}
          data-tile={k}
          style={{
            left: `${k * 100}%`,
            width: `${(((tile.period + tile.bleed) / tile.period) * 100).toFixed(4)}%`,
          }}
        >
          <Paintings art={flat.art} lod='near' />
        </div>
      ))}
    </>
  );
}

/** The shared flag: a pole and its pennant, each in both themes. The pennant runs up when its camp is reached. */
function Flag({ flat, reached }: { flat: Flat; reached: boolean }) {
  const layout = flagLayout(flat);
  if (!layout) return null;

  return (
    <>
      <div className='scene-flag-part' style={placed(layout.pole)}>
        {THEMES.map(theme => (
          <img
            key={theme}
            alt=''
            data-art={theme}
            data-src={artUrl(FLAG.art[theme].pole)}
            decoding='async'
            draggable={false}
          />
        ))}
      </div>
      <div
        className='scene-flag-part scene-pennant'
        data-reached={reached}
        style={placed(layout.cloth)}
      >
        {THEMES.map(theme => (
          <img
            key={theme}
            alt=''
            data-art={theme}
            data-src={artUrl(FLAG.art[theme].cloth)}
            decoding='async'
            draggable={false}
          />
        ))}
      </div>
    </>
  );
}

type SceneFlatProps = {
  flat: Flat;
  /** Its camp is reached: the flag is up. */
  reached: boolean;
};

/**
 * One flat of the scene: a whole painting the stage moves as one layer. Its box is authored at the largest it is
 * ever shown (`maxScale`), sized in CSS from the stage scale `--v`, so the scale the stage writes is always 1 or
 * less. A ridge has two versions inside: the far one (smaller, softer, hazed) and the near one, which carries the
 * flag; the stage cross-fades them by opacity as the camera approaches.
 */
export function SceneFlat({ flat, reached }: SceneFlatProps) {
  const max = maxScale(flat);
  const [bx, , bw] = flat.box;
  const [px, , pw] = flat.boxPhone;
  const phoneShare = { left: ((px - bx) / bw) * 100, top: 0, width: (pw / bw) * 100, height: 100 };

  return (
    <div
      className='scene-flat'
      data-scene-flat={flat.id}
      style={
        {
          '--bw': (flat.box[2] * max).toFixed(2),
          '--bh': (flat.box[3] * max).toFixed(2),
        } as React.CSSProperties
      }
    >
      {flat.art.day.far && (
        <div data-lod='far'>
          <Paintings art={flat.art} lod='far' />
        </div>
      )}
      <div data-lod='near'>
        {flat.tile ? (
          <Tiles flat={flat} />
        ) : (
          <Paintings art={flat.art} lod='near' phoneShare={phoneShare} />
        )}
        <Flag flat={flat} reached={reached} />
      </div>
    </div>
  );
}
