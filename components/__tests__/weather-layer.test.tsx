import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherLayer } from '@/components/scene/weather-layer';
import { weatherField } from '@/scene/weather';

const layerIn = (container: HTMLElement) => container.querySelector('.weather-layer');

describe('WeatherLayer', () => {
  it('renders every season at once, so CSS can pick without JavaScript', () => {
    const { container } = render(<WeatherLayer belowFirstCamp />);

    expect(container.querySelectorAll('.weather-bit')).toHaveLength(weatherField().length);
    ['snow', 'leaf', 'petal'].forEach(kind => {
      expect(container.querySelectorAll(`[data-kind='${kind}']`).length).toBeGreaterThan(0);
    });
  });

  /*
   * The flag is the whole of the treeline rule: the stylesheet keys off `data-low` to fade the leaves and blossom
   * and to leave the snow alone, so if the attribute stops being written the rule silently stops applying.
   */
  it('marks the layer while the climber is below the first camp', () => {
    const { container } = render(<WeatherLayer belowFirstCamp />);
    expect(layerIn(container)).toHaveAttribute('data-low');
  });

  it('drops the mark once the first camp is behind', () => {
    const { container } = render(<WeatherLayer belowFirstCamp={false} />);
    expect(layerIn(container)).not.toHaveAttribute('data-low');
  });
});
