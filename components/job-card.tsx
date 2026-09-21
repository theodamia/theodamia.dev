import { Eyebrow, Heading } from '@/components/ui/text';
import type { Job } from '@/lib/jobs';
import { cn } from '@/utils/cn';

type JobCardProps = {
  job: Job;
  index: number;
  /** The card sits left of the trail (its tent is on the right) or the other way round. */
  side: 'left' | 'right';
  /** Height of this stop in large viewport heights: the scroll length of the leg that leaves this camp. */
  legLvh: number;
};

/**
 * One stop on the climb. Everything is on the card at once, nothing behind a button: what the job was (role, period,
 * a one-sentence summary) on top, and what I did in its own pale panel below, so each is instant to find. The card
 * sits beside the trail in normal flow; no overlays anywhere.
 */
export function JobCard({ job, index, side, legLvh }: JobCardProps) {
  const pointsId = `job-${job.start}-did`;
  return (
    <li
      className={cn(
        'flex items-start max-[899px]:justify-center',
        side === 'left' ? 'justify-start' : 'justify-end'
      )}
      style={{ minHeight: `${legLvh}lvh` }}
    >
      <article
        data-card
        className='rounded-card border-line bg-card shadow-card w-[min(420px,100%)] overflow-hidden border max-[899px]:w-[min(480px,100%)]'
      >
        <div className='px-6 pt-[22px] pb-4'>
          <div className='flex items-center gap-2.5'>
            <span className='bg-accent inline-flex h-[26px] min-w-9 items-center justify-center rounded-full px-[9px] text-[13.5px] font-bold text-white'>
              {String(index + 1).padStart(2, '0')}
            </span>
            {job.url ? (
              <a
                href={job.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-ink-3 hover:text-ink text-[14.5px] leading-[1.4] font-semibold underline-offset-4 hover:underline'
              >
                {job.company} <span aria-hidden='true'>↗</span>
                <span className='sr-only'>(opens in a new tab)</span>
              </a>
            ) : (
              <Eyebrow>{job.company}</Eyebrow>
            )}
          </div>
          <Heading as='h2' size='card' className='mt-3'>
            {job.role}
          </Heading>
          <p className='text-ink-3 mt-1 text-[15.5px] font-medium'>
            {job.period} · {job.duration}
          </p>
          <p className='text-ink-2 mt-3 text-[16.5px] leading-[1.55] text-pretty'>{job.summary}</p>
        </div>

        <section
          aria-labelledby={pointsId}
          className='border-line bg-tint border-t px-6 pt-3.5 pb-4'
        >
          <h3 id={pointsId} className='text-ink-3 text-[14px] leading-[1.4] font-semibold'>
            What I did
          </h3>
          <ul className='mt-2 flex flex-col gap-1.5'>
            {job.highlights.map(point => (
              <li
                key={point}
                className='before:bg-accent text-ink relative pl-4 text-[15.5px] leading-[1.45] text-pretty before:absolute before:top-[9px] before:left-0 before:size-1.5 before:rounded-full'
              >
                {point}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </li>
  );
}
