import type React from 'react';
import { artUrl, CLOUDS, type Theme } from '@/scene/flats';

const THEMES: Theme[] = ['day', 'night'];

/**
 * One painted picture in both themes, as CSS backgrounds (`.about-art`): only the theme on screen is displayed, so
 * only its picture downloads.
 */
export function AboutArt({
  pictures,
  className,
}: {
  pictures: Record<Theme, string>;
  className?: string;
}) {
  return THEMES.map(theme => (
    <div
      key={theme}
      className={className ? `about-art ${className}` : 'about-art'}
      data-art={theme}
      style={{ backgroundImage: `url(${pictures[theme]})` }}
    />
  ));
}

/** A cloud on the climb's wind: which painting, how high, how wide (vh), where across it opens, its times (s). */
export type CloudWind = {
  cloud: number;
  top: string;
  width: number;
  at: number;
  cross: number;
  billow: number;
};

/**
 * The climb's own clouds and wind (`cloud-cross`, `cloud-billow`), in /about's skies. They cross their sky from
 * edge to edge in `cqw`, so their parent is a container; with reduced motion each stays where it opens.
 */
export function AboutClouds({ winds }: { winds: readonly CloudWind[] }) {
  return winds.map(wind => {
    const cloud = CLOUDS[wind.cloud];
    if (!cloud) return null;

    return (
      <div
        key={`${wind.cloud}-${wind.top}`}
        className='about-cloud'
        style={
          {
            top: wind.top,
            width: `${wind.width}vh`,
            aspectRatio: `${cloud.w} / ${cloud.h}`,
            '--at': wind.at,
            '--cross': `${wind.cross}s`,
            '--billow': `${wind.billow}s`,
          } as React.CSSProperties
        }
      >
        <AboutArt pictures={{ day: artUrl(cloud.art.day), night: artUrl(cloud.art.night) }} />
      </div>
    );
  });
}
