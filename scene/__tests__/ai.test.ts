import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { aiUrl, aspectOf, FINALE_SCENE, HEADER_SCENE } from '@/scene/ai';

const onDisk = (file: string) => existsSync(path.join(process.cwd(), 'public/ai', file));

describe('/ai scenes', () => {
  it('ships both scenes in both themes, every file on disk', () => {
    for (const scene of [HEADER_SCENE, FINALE_SCENE]) {
      expect(onDisk(scene.day)).toBe(true);
      expect(onDisk(scene.night)).toBe(true);
    }
  });

  it('keeps the finale wider than tall, so it can run along the bottom edge without filling the screen', () => {
    expect(aspectOf(FINALE_SCENE)).toBeGreaterThan(2);
    expect(aspectOf(HEADER_SCENE)).toBeGreaterThan(1);
  });

  it('serves them from /ai', () => {
    expect(aiUrl(HEADER_SCENE.day)).toBe(`/ai/${HEADER_SCENE.day}`);
  });
});
