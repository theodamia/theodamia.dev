/** Who the site is: the metadata, the hero, the contact rows and the social links all read from here. */
export const SITE = {
  /* the canonical origin: `metadataBase`, so every share card and canonical link resolves to one address */
  url: 'https://theodamia.dev',
  name: 'Theodore Damianidis',
  title: 'Senior Frontend Software Engineer',
  location: 'Thessaloniki, Greece',
  email: 'theodamia@gmail.com',
  linkedin: {
    url: 'https://www.linkedin.com/in/theodore-damianidis-19369714a/',
    handle: 'theodore-damianidis',
  },
  github: { url: 'https://github.com/theodamia', handle: 'theodamia' },
} as const;

/**
 * Over the summit, which the climb never reaches, and at the end of the list on /cv. Not a status but a stance:
 * never finished, always getting better, not giving up. It looks forward on purpose — what is left to climb, rather
 * than what has been climbed — which is the one thing ten years of history on the same page cannot say by itself.
 *
 * It says this once per screen. The altimeter used to carry the same words at the top of its rail, but the rail and
 * the summit are both in view at the end of the climb, and a stance read twice at once stops being a stance.
 *
 * Keep it short. It is drawn as SVG text at 26px, centred over the peak: past roughly 25 characters it stops
 * reading as a label on a mountain and starts reading as a banner across one.
 */
export const SUMMIT_LINE = 'The peak is still ahead';

/**
 * The top of the altimeter's rail, opposite the trailhead's "Start" at the bottom. A place, not a stance: the rail
 * is a map, and what it marks is where the trail is heading. The needle never arrives, which is the point made by
 * the scene's {@link SUMMIT_LINE} instead.
 */
export const SUMMIT_MARK = 'Summit';
