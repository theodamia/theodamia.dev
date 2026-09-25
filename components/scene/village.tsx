import { Fragment } from 'react';
import { LightSource } from '@/components/scene/light-source';
import { ART, layerX, layerY, VILLAGE, VILLAGE_GROUND_Y } from '@/scene/camp-layout';

/**
 * How far a house is sunk below the ground line, as a share of its height. It is drawn from slightly above, so its
 * back corners sit higher in the picture than its front one: bedded in until they meet the ground, it stands on the
 * level ground in front of the ridge line instead of balancing on it.
 */
const HOUSE_SINK_SHARE = 0.14;

/**
 * The village at the foot of the trail: one picture per house, in the layer that moves with the mountain, like the
 * camps. Their windows are lights that follow the night, not the climber: dark glass by day, lit as the night
 * reaches them. A house whose artwork has not arrived yet is still drawn by `scenery.ts`.
 */
export function Village() {
  return VILLAGE.map(house => {
    const art = ART[house.key];
    if (!art) return null;
    const height = (house.width * art.height) / art.width;
    const box = {
      left: house.x - house.width / 2,
      top: VILLAGE_GROUND_Y + height * HOUSE_SINK_SHARE - height,
      width: house.width,
      height,
    };

    return (
      <Fragment key={house.key}>
        <svg
          className='absolute overflow-visible'
          data-house={house.key}
          viewBox={`0 0 ${box.width} ${box.height.toFixed(2)}`}
          style={{
            left: layerX(box.left),
            top: layerY(box.top),
            width: layerX(box.width),
            height: layerY(box.height),
          }}
        >
          <image
            href={`/camps/${house.key}.webp`}
            className='camp-art'
            width={box.width}
            height={box.height.toFixed(2)}
          />
        </svg>
        {(art.lights ?? []).map(light => (
          <LightSource
            key={light.id}
            art={house.key}
            light={light}
            box={{
              left: box.left + light.x * box.width,
              top: box.top + light.y * box.height,
              width: light.width * box.width,
              height: light.height * box.height,
            }}
          />
        ))}
      </Fragment>
    );
  });
}
