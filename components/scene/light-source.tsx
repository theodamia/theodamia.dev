import { layerX, layerY, type CampLight } from '@/lib/scene/camp-layout';

/**
 * How far the glow reaches, in widths of the lit shape: a fire throws light wide, a lantern keeps it close, a window
 * closer still. What gives no light (a spinner's blades, a flag's cloth) has no glow.
 */
const GLOW_SPREAD: Partial<Record<string, number>> = { fire: 3.4, lantern: 4.2, window: 2.4 };

type LightSourceProps = {
  /** The picture it belongs to: its layers are `/camps/<art>-<light id>.webp`. */
  art: string;
  light: CampLight;
  /** Its box in world units, in the layer that moves with the mountain. */
  box: { left: number; top: number; width: number; height: number };
  /**
   * A camp's light comes on when the climber gets there. Without this, it follows the night instead (a house's
   * window): off by day, on at night, and one of the theme reveal's `data-wave` targets, so it comes on as the night
   * reaches it.
   */
  reached?: boolean;
};

/**
 * Something in a picture that comes alive: a fire, a lantern, a lit window, a wind spinner's blades, a flag's cloth.
 * HTML, not SVG, on purpose: opacity and transform animations on these run on the compositor, so something that
 * flickers, breathes, spins or ripples forever never repaints the mountain. The rules are under `.camp-light-source`
 * in globals.css.
 */
export function LightSource({ art, light, box, reached }: LightSourceProps) {
  const spread = GLOW_SPREAD[light.kind];
  const followsNight = reached === undefined;
  const origin =
    light.originX === undefined || light.originY === undefined
      ? undefined
      : `${light.originX * 100}% ${light.originY * 100}%`;

  return (
    <div
      className='camp-light-source absolute'
      data-kind={light.kind}
      data-reached={followsNight ? undefined : reached}
      data-wave={followsNight ? '' : undefined}
      style={{
        left: layerX(box.left),
        top: layerY(box.top),
        width: layerX(box.width),
        height: layerY(box.height),
      }}
    >
      {spread !== undefined && (
        <div className='camp-glow' style={{ inset: `${(-(spread - 1) / 2) * 100}%` }} />
      )}
      <div
        className='camp-lit'
        style={{
          backgroundImage: `url(/camps/${art}-${light.id}.webp)`,
          transformOrigin: origin,
        }}
      />
      {light.kind === 'fire' && (
        <div
          className='camp-lit camp-lit-core'
          style={{ backgroundImage: `url(/camps/${art}-${light.id}-core.webp)` }}
        />
      )}
    </div>
  );
}
