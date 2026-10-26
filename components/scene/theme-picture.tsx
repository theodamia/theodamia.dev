import { THEMES, type Theme } from '@/scene/flats';
import { cn } from '@/utils/cn';

/**
 * One painting in both themes, as CSS backgrounds (`.theme-art` in globals.css): only the theme on screen is
 * displayed, so only its picture downloads, and a theme already seen stays underneath the other while the new one
 * arrives. `className` places it; without one it fills its parent.
 */
export function ThemePicture({
  pictures,
  className,
}: {
  pictures: Record<Theme, string>;
  className?: string;
}) {
  return THEMES.map(theme => (
    <div
      key={theme}
      className={cn('theme-art theme-picture', className)}
      data-art={theme}
      style={{ backgroundImage: `url(${pictures[theme]})` }}
    />
  ));
}
