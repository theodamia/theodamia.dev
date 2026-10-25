import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { YearBackdrop } from '@/components/scene/year-backdrop';
import { YearWeather } from '@/components/scene/year-weather';
import { SEASONS, seasonOf, weatherField, YEAR_STATES, yearTimeline } from '@/scene/seasons';

describe('YearBackdrop', () => {
  it('is decoration only: hidden from assistive technology, on paper and below the wide breakpoint', () => {
    const { container } = render(<YearBackdrop />);

    const backdrop = container.firstElementChild!;
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveClass('print:hidden', 'max-wide:hidden');
  });

  it('fades each state in on its own hairline and out on the next one', () => {
    const { container } = render(<YearBackdrop />);

    const stack = container.querySelector('.year-stack')!;
    const fades = [...stack.querySelectorAll<HTMLElement>('.year-fade')];
    const ins = fades
      .filter(fade => fade.dataset.fade === 'in')
      .map(fade => fade.style.animationTimeline);
    const outs = fades
      .filter(fade => fade.dataset.fade === 'out')
      .map(fade => fade.style.animationTimeline);
    const hairlines = Array.from({ length: YEAR_STATES - 1 }, (_, i) => yearTimeline(i + 1));

    expect(stack.querySelectorAll('.year-state')).toHaveLength(YEAR_STATES);
    expect(ins).toEqual(hairlines);
    expect(outs).toEqual(hairlines);
  });

  it('carries every season in every state, so the date only has to pick a column', () => {
    const { container } = render(<YearBackdrop />);

    const pictured = [...container.querySelectorAll('.year-state')].filter(state =>
      state.querySelector(':scope > .year-season')
    );
    expect(pictured).toHaveLength(YEAR_STATES * 2);

    pictured.forEach(state => {
      const seasons = [...state.querySelectorAll<HTMLElement>(':scope > .year-season')];
      expect(seasons.map(season => season.dataset.j)).toEqual(['0', '1', '2', '3']);
      expect(new Set(seasons.map(season => season.dataset.season))).toEqual(new Set(SEASONS));
    });
  });

  it('paints each picture in both themes, as backgrounds a hidden picture never downloads', () => {
    const { container } = render(<YearBackdrop />);

    const land = container.querySelector('.year-season .year-art[data-art="day"]')!;
    const night = container.querySelector('.year-season .year-art[data-art="night"]')!;
    [land, night].forEach(picture => {
      expect(picture.querySelector<HTMLElement>('.year-grove')!.style.backgroundImage).toMatch(
        /^url\("?\/seasons\/grove-[a-z]+-(day|night)\.[0-9a-f]{8}\.webp"?\)$/
      );
      expect(picture.querySelector<HTMLElement>('.year-meadow')!.style.backgroundImage).toMatch(
        /^url\("?\/seasons\/meadow-/
      );
    });
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });
});

describe('YearWeather', () => {
  it('gives each state the weather of the season it shows, from the year the page starts in', () => {
    document.documentElement.dataset.yearStart = '3';
    const { container } = render(<YearWeather />);

    const states = [...container.querySelectorAll('.year-state')];
    expect(states).toHaveLength(YEAR_STATES);
    states.forEach((state, k) => {
      const kinds = new Set(
        [...state.querySelectorAll<HTMLElement>('.weather-bit')].map(bit => bit.dataset.kind)
      );
      expect(kinds).toEqual(new Set([weatherField(seasonOf(3, k))[0].kind]));
    });
    delete document.documentElement.dataset.yearStart;
  });
});
