'use client';

import { useCallback, useState } from 'react';
import { BackToTop } from '@/components/back-to-top';
import { ClimbChart } from '@/components/climb-chart';
import { ClimbLadder } from '@/components/climb-ladder';
import { ConfidenceFigure } from '@/components/confidence-figure';
import { FigureCard, FigureCaption, FigureLabel } from '@/components/figure-card';
import { MarginNotes } from '@/components/margin-notes';
import { OpinionsFigure } from '@/components/opinions-figure';
import { RoleDrawer } from '@/components/role-drawer';
import { SkillDrawersFigure } from '@/components/skill-drawers-figure';
import { StatRow } from '@/components/stat-row';
import { TenureFigure } from '@/components/tenure-figure';
import { WeekFigure } from '@/components/week-figure';
import { PHONE_QUERY } from '@/lib/constants';
import { CONTACT_LINKS } from '@/lib/figures';
import { MILESTONES } from '@/lib/milestones';
import { useMediaQuery } from '@/lib/use-media-query';

/** View 1 — the CV as seven hand-drawn figures on graph paper. */
export function ClimbView() {
  const isPhone = useMediaQuery(PHONE_QUERY);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  // Held separately from `open` so the drawer keeps its content while it slides back out.
  const [detail, setDetail] = useState(0);

  const selectMilestone = useCallback((index: number) => {
    setDetail(index);
    setOpen(true);
    setShowAll(false);
  }, []);

  const openAllSteps = useCallback(() => {
    setShowAll(true);
    setOpen(false);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setShowAll(false);
  }, []);

  return (
    <main id='top' className='graph-paper relative px-7 pt-[120px] pb-[90px]'>
      <div className='mx-auto max-w-[1120px]'>
        <div className='border-ink flex flex-wrap items-end justify-between gap-5 border-b-2 pb-[26px]'>
          <div>
            <h1 className='font-hand text-[clamp(40px,7vw,78px)] leading-[0.98]'>
              A career, badly graphed
            </h1>
            <p className='text-ink-muted mt-3.5 max-w-[560px] text-[16.5px] leading-[1.6]'>
              Same CV, plotted. Hover anything for the numbers — the wobbly lines are on purpose,
              the data isn&rsquo;t.
            </p>
          </div>
          <div className='flex flex-col gap-[3px] text-right font-mono text-[12px]'>
            {CONTACT_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className='text-accent hover:text-accent-hover'
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className='mt-9 grid [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))] gap-[26px]'>
          <FigureCard className='col-span-full'>
            <FigureLabel className='mb-1.5'>
              Fig. 1 —{' '}
              <button
                type='button'
                data-keep-drawer='true'
                onClick={openAllSteps}
                className='border-accent/70 text-accent-strong hover:text-accent-hover cursor-pointer border-b border-dashed'
              >
                the climb ↗
              </button>
            </FigureLabel>

            {isPhone ? (
              <ClimbLadder onSelect={selectMilestone} />
            ) : (
              <ClimbChart onSelect={selectMilestone} />
            )}

            <FigureCaption className='mt-2.5 text-[16px]'>
              {isPhone
                ? 'Ten years from student to Frontend Lead, summit first. Tap a step for the full story.'
                : 'Ten years from student to Frontend Lead — a UI library, a design-system rewrite and the architecture calls behind them. Still climbing. Hover a landmark for the short version, click for the full one.'}
            </FigureCaption>
          </FigureCard>

          <div className='col-span-full grid [grid-template-columns:repeat(auto-fit,minmax(255px,1fr))] items-stretch gap-[26px]'>
            <TenureFigure />
            <OpinionsFigure />
            <ConfidenceFigure />
          </div>

          <WeekFigure />
          <SkillDrawersFigure />
        </div>

        <StatRow />
        <MarginNotes />

        <p className='text-ink-ghost mt-[34px] font-mono text-[11px] tracking-[0.16em] uppercase'>
          Percentages self-reported, generously
        </p>
      </div>

      <BackToTop />

      <RoleDrawer
        open={open}
        showAll={showAll}
        milestone={MILESTONES[detail]}
        onClose={closeDrawer}
      />
    </main>
  );
}
