import type { Theme } from '@/scene/flats';
import manifest from './ai.json';

/**
 * /ai's two scenes as numbers (scripts/process-ai.mjs): the header, where the giant looks at a range turning from a
 * wireframe draft into paint, and the finale, where it waits at a fork in the trail, not choosing. Each is one
 * painting by day and by night with one outline, trimmed of the sky above it; `size` is what is left, in px.
 */
type Scene = { size: number[] } & Record<Theme, string>;

export const HEADER_SCENE: Scene = manifest.header;
export const FINALE_SCENE: Scene = manifest.finale;

/** A scene's width against its height: what the page sizes its box by. */
export const aspectOf = (scene: Scene) => scene.size[0] / scene.size[1];

export const aiUrl = (file: string) => `/ai/${file}`;
