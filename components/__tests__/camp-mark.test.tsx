import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AscentStage } from '@/components/scene/ascent-stage';
import { tentFor } from '@/components/scene/camp-mark';
import { JOBS, TRAILHEAD } from '@/lib/jobs';

function reachedFlags(container: HTMLElement) {
  return [...container.querySelectorAll('svg.camp')].map(camp => camp.getAttribute('data-reached'));
}

describe('camps on the stage', () => {
  it('draws the trailhead and one camp per job, named, in a layer of their own', () => {
    const { container } = render(<AscentStage ref={null} reducedMotion={false} stop={0} />);

    const camps = [...container.querySelectorAll('svg.camp')];
    expect(camps).toHaveLength(JOBS.length + 1);
    expect(camps.map(camp => camp.querySelector('text')?.textContent)).toEqual([
      TRAILHEAD.label,
      ...JOBS.map(job => job.place),
    ]);
    camps.forEach(camp => expect(camp.closest('svg.scene-layer')).toBeNull());
  });

  it('pitches a bigger shelter as the career climbs', () => {
    const { container } = render(<AscentStage ref={null} reducedMotion={false} stop={0} />);

    const tents = [...container.querySelectorAll('svg.camp')].map(camp =>
      camp.getAttribute('data-tent')
    );
    /* the trailhead is a signpost with no flag; a job shows its artwork once there is some, a tent until then */
    expect(['art', 'signpost']).toContain(tents[0]);
    expect(container.querySelector('svg.camp')?.querySelector('.camp-pennant')).toBeNull();
    tents.slice(1).forEach((tent, i) => expect(['art', tentFor(JOBS[i].level)]).toContain(tent));
    expect(JOBS.map(job => tentFor(job.level))).toEqual([
      'ridge',
      'ridge',
      'ridge',
      'dome',
      'dome',
    ]);
  });

  it("lights a camp's fire only once the camp is reached", () => {
    const { container, rerender } = render(
      <AscentStage ref={null} reducedMotion={false} stop={0} />
    );
    /* the village's windows follow the night, not the climber (next test) */
    const campLights = () => container.querySelectorAll('.camp-light-source[data-reached]');
    const fires = () => [...campLights()].map(light => light.getAttribute('data-reached'));
    const count = fires().length;
    expect(count).toBeGreaterThan(0);
    campLights().forEach(light =>
      expect(['fire', 'lantern', 'spinner', 'flag']).toContain(light.getAttribute('data-kind'))
    );
    expect(fires().every(lit => lit === 'false' || lit === 'true')).toBe(true);

    rerender(<AscentStage ref={null} reducedMotion={false} stop={JOBS.length} />);
    expect(fires()).toEqual(Array(count).fill('true'));
  });

  it('raises a flag at every job camp, none at the trailhead, as each one is reached', () => {
    const { container, rerender } = render(
      <AscentStage ref={null} reducedMotion={false} stop={1} />
    );
    const flags = () =>
      [...container.querySelectorAll('.camp-light-source[data-kind="flag"]')].map(flag =>
        flag.getAttribute('data-reached')
      );
    /* one per job (the trailhead has none); the first camp is reached, the rest wait */
    expect(flags()).toEqual(['true', ...Array(JOBS.length - 1).fill('false')]);
    /* the pole stays in the camp's picture; only the cloth is a layer of its own */
    expect(container.querySelectorAll('svg.camp image[href="/camps/flag.webp"]')).toHaveLength(
      JOBS.length
    );

    rerender(<AscentStage ref={null} reducedMotion={false} stop={JOBS.length} />);
    expect(flags()).toEqual(Array(JOBS.length).fill('true'));
  });

  it("lights the village's windows by night, whatever camp the climber has reached", () => {
    const { container, rerender } = render(
      <AscentStage ref={null} reducedMotion={false} stop={0} />
    );
    const windows = () => [...container.querySelectorAll('.camp-light-source[data-kind="window"]')];
    expect(windows().length).toBeGreaterThan(0);
    windows().forEach(light => {
      expect(light).not.toHaveAttribute('data-reached');
      /* the theme reveal times it, so it comes on as the night reaches it */
      expect(light).toHaveAttribute('data-wave');
    });

    rerender(<AscentStage ref={null} reducedMotion={false} stop={JOBS.length} />);
    windows().forEach(light => expect(light).not.toHaveAttribute('data-reached'));
  });

  it('starts with only the trailhead reached', () => {
    const { container } = render(<AscentStage ref={null} reducedMotion={false} stop={0} />);

    expect(reachedFlags(container)).toEqual(['true', 'false', 'false', 'false', 'false', 'false']);
  });

  it('conquers every camp up to the stop reached, and gives them back on the way down', () => {
    const { container, rerender } = render(
      <AscentStage ref={null} reducedMotion={false} stop={3} />
    );
    expect(reachedFlags(container)).toEqual(['true', 'true', 'true', 'true', 'false', 'false']);

    rerender(<AscentStage ref={null} reducedMotion={false} stop={1} />);
    expect(reachedFlags(container)).toEqual(['true', 'true', 'false', 'false', 'false', 'false']);
  });
});
