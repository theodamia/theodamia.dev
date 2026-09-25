import type React from 'react';
import { LightSource } from '@/components/scene/light-source';
import { ART, ART_LEFT, artExtrasFor, artWidthFor, layerX, layerY } from '@/lib/scene/camp-layout';
import { CAMP_X, CAMP_Y } from '@/lib/scene/world';

/** The camp's own little canvas, in world units around the camp point: wide enough for the longest name. */
const BOX = { left: -170, top: -132, width: 340, height: 148 };
/**
 * How far a picture is sunk below the ridge, as a share of its height, when it differs from the default: artwork
 * drawn side-on stands on its own baseline and only needs bedding in, artwork drawn from above sits on the face.
 */
const ART_SINK_SHARES: Record<string, number> = {
  'camp-start': 0.04,
  'camp-2015': 0.02,
  'camp-2016': 0.03,
  'camp-2022': 0.3,
  'camp-2026': 0.24,
  'camp-2026-spinner': 0.2,
};
/**
 * The artwork stands just right of where the trail arrives. It is drawn from slightly above, with depth: its back
 * corner sits higher in the picture than its front, and props in front (a campfire) lower still. Balanced on the
 * skyline, the back of the tent would hang in the sky. So the picture is sunk until even its back corner is below
 * the ridge: the camp sits on the face of the mountain and the ridge line passes behind the tent.
 */
const ART_SINK_SHARE = 0.43;
const ART_POLE_X = -32;
const LABEL_GAP = 16;
const POLE_X = -34;
/** The tent stands beside the point where the trail arrives, so the climber stops at its door, not on top of it. */
const TENT_PLACEMENT = 'translate(36 0) scale(1.15)';
const TENT_CENTER_X = 40;
const POLE_HEIGHT = 74;
/**
 * The flag every camp raises is one picture (`flag` in the manifest): its pole and stones, with the cloth taken off
 * as a layer of its own that runs up the pole on arrival. It stands where the drawn pole would, this tall from the
 * foot of its stones to the tip of its cap, bedded in a little like the side-on artwork.
 */
const FLAG_ART = ART.flag;
const FLAG_HEIGHT = 86;
const FLAG_SINK_SHARE = 0.04;

/** The shelter grows with the career: a ridge tent on the climb, an expedition dome up high. */
export type TentKind = 'ridge' | 'dome';
/** What stands at a camp until its artwork arrives: a tent for a job, a signpost for the trailhead. */
type CampKind = TentKind | 'signpost';
const DOME_FROM_LEVEL = 5;

/** Which shelter a job's seniority earns, used where a camp has no artwork yet. */
export function tentFor(level: number): TentKind {
  return level >= DOME_FROM_LEVEL ? 'dome' : 'ridge';
}

/** Shared strokes: a heavy ink outline for the silhouette, a lighter one for seams, a thin one for guy lines. */
const OUTLINE = { className: 'stroke-ink', strokeWidth: 3, strokeLinejoin: 'round' } as const;
const SEAM = {
  className: 'stroke-ink fill-none',
  strokeWidth: 2,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const;
const TRIM = {
  className: 'camp-light stroke-ink',
  strokeWidth: 1.6,
  strokeLinejoin: 'round',
} as const;
const GUY = {
  className: 'stroke-ink fill-none',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
} as const;
const PEG = { className: 'stroke-ink', strokeWidth: 2.4, strokeLinecap: 'round' } as const;

function GuyLine({ from, to }: { from: [number, number]; to: [number, number] }) {
  return (
    <>
      <path d={`M${from[0]},${from[1]} L${to[0]},${to[1]}`} {...GUY} />
      <path d={`M${to[0] - 3},${to[1] - 4} l6,8`} {...PEG} />
    </>
  );
}

/** A bigger ridge tent: door flaps tied back, a pale stripe along the side. */
function RidgeTent() {
  return (
    <>
      <GuyLine from={[-4, -54]} to={[-44, 1]} />
      <GuyLine from={[38, -47]} to={[62, 1]} />
      <path d='M-4,-54 L38,-47 L50,0 L24,0 Z' {...OUTLINE} className='camp-shade stroke-ink' />
      <path d='M9.5,-27.5 L43.6,-22.8 L45.9,-13 L15,-16.5 Z' {...TRIM} />
      <path d='M-32,0 L-4,-54 L24,0 Z' {...OUTLINE} className='camp-canvas stroke-ink' />
      <path d='M-15,0 L-4,-33 L7,0 Z' className='fill-shade' />
      <path d='M-15,0 L-4,-33 L-21,-4 Z' {...TRIM} />
      <path d='M7,0 L-4,-33 L13,-4 Z' {...TRIM} />
      <path d='M-4,-54 l-3,-7' {...SEAM} />
    </>
  );
}

/** An expedition dome: crossed poles, a pale cap, an arched doorway. */
function DomeTent() {
  const shell = 'M-38,0 C-38,-32 -21,-52 0,-52 C21,-52 38,-32 38,0 Z';

  return (
    <>
      <GuyLine from={[-31, -22]} to={[-50, 1]} />
      <GuyLine from={[31, -22]} to={[54, 1]} />
      <path d={shell} className='camp-canvas' />
      <path d='M14,0 C14,-30 7,-47 0,-52 C21,-52 38,-32 38,0 Z' className='camp-shade' />
      <path
        d='M-34.5,-17 C-13,-31 13,-31 34.5,-17 C29,-38 16,-52 0,-52 C-16,-52 -29,-38 -34.5,-17 Z'
        className='camp-light'
      />
      <path d='M-34.5,-17 C-13,-31 13,-31 34.5,-17' {...SEAM} />
      <path d='M-14,0 C-14,-30 -7,-47 0,-52 M14,0 C14,-30 7,-47 0,-52' {...SEAM} />
      <path d={shell} {...OUTLINE} className='stroke-ink fill-none' />
      <path d='M-10,0 C-10,-17 -6,-25 0,-25 C6,-25 10,-17 10,0 Z' className='fill-shade' />
    </>
  );
}

/** The trailhead: a wooden signpost with two blank boards and a few stones at its foot. */
function Signpost() {
  return (
    <>
      <path d='M-3,0 V-66 H3 V0 Z' {...OUTLINE} className='camp-shade stroke-ink' />
      <path d='M-2,-62 H30 L40,-53 L30,-44 H-2 Z' {...OUTLINE} className='camp-light stroke-ink' />
      <path d='M2,-38 H-26 L-35,-30 L-26,-22 H2 Z' {...OUTLINE} className='camp-light stroke-ink' />
      <path d='M6,-53 H24 M-20,-30 H-4' {...SEAM} />
      <path
        d='M-16,0 C-16,-9 -6,-10 -2,-4 C2,-12 14,-10 14,0 Z'
        {...OUTLINE}
        className='fill-mist stroke-ink'
      />
    </>
  );
}

const TENTS: Record<CampKind, () => React.ReactElement> = {
  signpost: Signpost,
  ridge: RidgeTent,
  dome: DomeTent,
};

type CampMarkProps = {
  index: number;
  /** Key of this camp's generated artwork (`camp-<start year>`), stable when jobs are added or removed. */
  artKey: string;
  name: string;
  tent: CampKind;
  /** Reached camps are conquered: tent in colour, flag at the top of its pole. */
  reached: boolean;
};

/**
 * One camp: ground, tent or artwork, flag pole, pennant and name. The camp itself never changes: it stands in full
 * colour at full size from the start. What marks the arrival is the flag running up its pole, the name brightening
 * and, where the artwork has one, the camp's own light coming on: a campfire that flickers, a lantern that breathes
 * (see the `.camp-*` rules in globals.css). A small SVG of its own, so the animation repaints only this.
 *
 * Tents are flat and ink-outlined like the rest of the scene, never realistic: form comes from a lit front, a
 * shaded side and a few seams. They are about 55px wide on screen, so every detail has to read at that size.
 */
export function CampMark({ index, artKey, name, tent, reached }: CampMarkProps) {
  const Tent = TENTS[tent];
  const art = ART[artKey];
  const artWidth = artWidthFor(artKey);
  const artHeight = art ? (artWidth * art.height) / art.width : 0;
  const artSink = artHeight * (ART_SINK_SHARES[artKey] ?? ART_SINK_SHARE);
  const poleX = art ? ART_POLE_X : POLE_X;
  /* the trailhead is a signpost: nothing to conquer, so no flag to raise */
  const hasFlag = tent !== 'signpost';
  const groundWidth = hasFlag ? 66 : 30;
  /* the camp's middle (the label hangs over it) and the top of its picture, which the name sits above */
  const centerX = art ? ART_LEFT + artWidth / 2 : TENT_CENTER_X;
  const labelY = art ? artSink - artHeight - LABEL_GAP : -96;
  /* the flag's picture, standing where the pole goes: its `poleX` is where the pole is in the picture */
  const flagWidth = FLAG_ART ? (FLAG_HEIGHT * FLAG_ART.width) / FLAG_ART.height : 0;
  const flag =
    hasFlag && FLAG_ART
      ? [
          {
            key: 'flag',
            art: FLAG_ART,
            left: poleX - (FLAG_ART.poleX ?? 0.5) * flagWidth,
            width: flagWidth,
            height: FLAG_HEIGHT,
            sink: FLAG_HEIGHT * FLAG_SINK_SHARE,
          },
        ]
      : [];
  /* every picture of this camp: the flag, the main artwork, then any that stand beside it */
  const pieces = [
    ...flag,
    ...(art
      ? [
          { key: artKey, art, left: ART_LEFT, width: artWidth, height: artHeight, sink: artSink },
          ...artExtrasFor(artKey).flatMap(extra => {
            const extraArt = ART[extra.key];
            if (!extraArt) return [];
            const height = (extra.width * extraArt.height) / extraArt.width;
            const sink = height * (ART_SINK_SHARES[extra.key] ?? ART_SINK_SHARE);

            return [
              { key: extra.key, art: extraArt, left: extra.left, width: extra.width, height, sink },
            ];
          }),
        ]
      : []),
  ];
  const camp = (
    <svg
      className='camp absolute overflow-visible'
      data-reached={reached}
      data-tent={art ? 'art' : tent}
      viewBox={`${BOX.left} ${BOX.top} ${BOX.width} ${BOX.height}`}
      style={{
        left: layerX(CAMP_X[index] + BOX.left),
        top: layerY(CAMP_Y[index] + BOX.top),
        width: layerX(BOX.width),
        height: layerY(BOX.height),
      }}
    >
      {/* the ground under the camp: a faint pitch for artwork (it sits on the mountain's face), a shadow otherwise */}
      <ellipse
        cx={centerX}
        cy={art ? artSink * 0.62 : 3}
        rx={art ? artWidth * 0.56 : groundWidth}
        ry={art ? artSink * 0.46 : 6.5}
        className={art ? 'fill-shade/5' : 'fill-shade/14'}
      />
      {/* no flag picture yet: a drawn pole and pennant that runs up it */}
      {hasFlag && !FLAG_ART && (
        <>
          <path
            d={`M${poleX},0 v-${POLE_HEIGHT}`}
            className='stroke-ink fill-none'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d={`M${poleX},-${POLE_HEIGHT} l30,10 l-30,10 Z`}
            className='camp-pennant fill-accent'
          />
        </>
      )}
      {/* the flag and the name mark the arrival; if the artwork has something to light, that lights up too */}
      {pieces.map(piece => (
        <image
          key={piece.key}
          href={`/camps/${piece.key}.webp`}
          className='camp-art'
          x={piece.left}
          y={piece.sink - piece.height}
          width={piece.width}
          height={piece.height}
        />
      ))}
      {!art && (
        <g transform={TENT_PLACEMENT}>
          <Tent />
        </g>
      )}
      <text
        x={art ? centerX : 14}
        y={labelY}
        textAnchor='middle'
        className='camp-label fill-ink font-display text-[30px] font-semibold'
        style={{
          paintOrder: 'stroke',
          stroke: 'var(--color-halo)',
          strokeWidth: 7,
          strokeLinejoin: 'round',
        }}
      >
        {name}
      </text>
    </svg>
  );
  const lights = pieces.flatMap(piece => (piece.art.lights ?? []).map(light => ({ piece, light })));
  if (!lights.length) return camp;

  return (
    <>
      {camp}
      {lights.map(({ piece, light }) => (
        <LightSource
          key={`${piece.key}-${light.id}`}
          art={piece.key}
          light={light}
          reached={reached}
          /* its box in world units, from its place inside the artwork */
          box={{
            left: CAMP_X[index] + piece.left + light.x * piece.width,
            top: CAMP_Y[index] + piece.sink - piece.height + light.y * piece.height,
            width: light.width * piece.width,
            height: light.height * piece.height,
          }}
        />
      ))}
    </>
  );
}
