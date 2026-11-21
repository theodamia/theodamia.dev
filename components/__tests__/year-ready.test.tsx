import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { YearBackdrop } from '@/components/scene/year-backdrop';
import { YearReady } from '@/components/scene/year-ready';
import { SEASON_ART, SEASONS, seasonUrl } from '@/scene/seasons';

/** Every season's grove and meadow for one theme, as the page asks for them. */
const paintings = (theme: 'day' | 'night') =>
  SEASONS.flatMap(season => [
    seasonUrl(SEASON_ART[season][theme].grove),
    seasonUrl(SEASON_ART[season][theme].meadow),
  ]).sort();

/** The paths of the images decoded so far (jsdom resolves `src` against its own origin). */
function watchDecodes() {
  const decoded: string[] = [];

  vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
    this: HTMLImageElement
  ) {
    decoded.push(new URL(this.src).pathname);

    return Promise.resolve();
  });

  return decoded;
}

describe('YearReady', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete document.documentElement.dataset.yearReady;
    delete document.documentElement.dataset.theme;
  });

  it('lets the later states show once the page has loaded', () => {
    render(<YearReady />);

    expect(document.documentElement.dataset.yearReady).toBe('');
  });

  it("decodes every season's paintings for the theme on screen, each once, ahead of its turn", async () => {
    const decoded = watchDecodes();
    render(
      <>
        <YearBackdrop />
        <YearReady />
      </>
    );

    await waitFor(() => expect([...decoded].sort()).toEqual(paintings('day')));
  });

  it("decodes the other theme's paintings when the switch is pressed", async () => {
    const decoded = watchDecodes();
    render(
      <>
        <YearBackdrop />
        <YearReady />
      </>
    );
    await waitFor(() => expect(decoded).toHaveLength(paintings('day').length));

    document.documentElement.dataset.theme = 'dark';

    await waitFor(() =>
      expect(decoded.slice(paintings('day').length).sort()).toEqual(paintings('night'))
    );
  });
});
