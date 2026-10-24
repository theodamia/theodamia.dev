import type React from 'react';

type CampDoorProps = {
  /** Open while the closing card is set aside: the lamp is lit and the camp answers a click. */
  open: boolean;
  onOpen: () => void;
  ref: React.Ref<HTMLButtonElement>;
};

/**
 * The way back to the closing card, in the world: today's camp itself. While the card is set aside, a lamp burns
 * in the tent's doorway and the camp answers a click (or Enter), bringing the card back out of the tent; hovering or
 * focusing it brightens the lamp and shows "Today's note" under the camp's name.
 *
 * It is a real button, named for what it does, laid over the camp from the page rather than drawn inside the stage:
 * the stage is hidden from assistive technology and sits under the page, so nothing in it could be clicked. The
 * stage still owns where it stands (`todayDoor` in scene/camera.ts): it sizes the door on resize and moves it with
 * the camp each frame, a transform like any other layer.
 */
export function CampDoor({ open, onOpen, ref }: CampDoorProps) {
  return (
    <button
      ref={ref}
      type='button'
      data-camp-door
      hidden={!open}
      aria-label="Today's note: The ascent never stops"
      onClick={onOpen}
      className='camp-door'
    >
      <span className='camp-door-lamp' aria-hidden='true'>
        <span className='camp-door-flame' />
      </span>
    </button>
  );
}
