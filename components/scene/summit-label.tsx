import { layerX, layerY } from '@/scene/camp-layout';
import { summitLabelMarkup, SUMMIT_LABEL } from '@/scene/scenery';
import { SUMMIT_LINE } from '@/content/site';

/**
 * The label's own canvas, in world units around the summit point. Wide enough for a line of a dozen words at
 * `SUMMIT_LABEL.size`, with room above for the halo stroke; `overflow-visible` covers anything longer.
 */
const BOX = { left: -320, top: -46, width: 640, height: 64 };

const MARKUP = summitLabelMarkup(SUMMIT_LINE);

/**
 * The words over the summit, in a small SVG of its own inside the layer that moves with the mountain, drawn from
 * the same generator that used to put them in the trail layer. Lifted out so it can fade on its own: an opacity
 * transition on something inside a full-height layer repaints that whole layer for every frame of the fade, which
 * is the one thing the scroll cannot afford. Same pattern as the camps, and for the same reason.
 *
 * It goes once the climb is over. Read at the top, with the closing card up and the last job behind you, the line
 * has nothing left to point at: the summit it labels is off the top of the screen and the words sit by themselves
 * in the sky, looking like something the page forgot to clear away.
 */
export function SummitLabel({ gone }: { gone: boolean }) {
  return (
    <svg
      className='summit-label absolute overflow-visible'
      data-gone={gone}
      viewBox={`${SUMMIT_LABEL.x + BOX.left} ${SUMMIT_LABEL.y + BOX.top} ${BOX.width} ${BOX.height}`}
      style={{
        left: layerX(SUMMIT_LABEL.x + BOX.left),
        top: layerY(SUMMIT_LABEL.y + BOX.top),
        width: layerX(BOX.width),
        height: layerY(BOX.height),
      }}
      dangerouslySetInnerHTML={{ __html: MARKUP }}
    />
  );
}
