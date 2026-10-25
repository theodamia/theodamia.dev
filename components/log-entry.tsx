import { Heading } from '@/components/ui/text';
import type { Job } from '@/content/jobs';

type LogEntryProps = {
  job: Job;
};

/**
 * One job in the field log on /cv. Open text on the log's hairline, not a card: the date line ("Mar 2026 –
 * present · 7 months"), the role, the company, one sentence and what I did, all at once. The climb carries
 * the same facts on cards (job-card.tsx); this is the plain reading of them, which is /cv's identity. The `<li>`
 * around it, the rail and the node are the log's (field-log.tsx), as each page owns the stop around its job.
 */
export function LogEntry({ job }: LogEntryProps) {
  const roleId = `entry-${job.start}`;

  return (
    <article
      aria-labelledby={roleId}
      className='border-line border-t pt-7 pb-9 print:border-t-0 print:pt-5 print:pb-1'
    >
      <p className='text-ink-3 text-[14.5px] leading-[1.4] font-semibold'>
        {job.period} · {job.duration}
      </p>
      <Heading as='h2' size='card' id={roleId} className='max-wide:text-[22px] mt-2'>
        {job.role}
      </Heading>
      <p className='text-ink-2 mt-1.5 text-[15.5px] leading-[1.4] font-semibold'>
        {job.url ? (
          <a
            href={job.url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-ink underline-offset-4 hover:underline'
          >
            {job.company} <span aria-hidden='true'>↗</span>
            <span className='sr-only'>(opens in a new tab)</span>
          </a>
        ) : (
          job.company
        )}
      </p>
      <p className='text-ink-2 mt-3 max-w-[60ch] text-[16.5px] leading-[1.55] text-pretty'>
        {job.summary}
      </p>
      <h3 className='text-ink-3 mt-[18px] text-[14px] leading-[1.4] font-semibold'>What I did</h3>
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
    </article>
  );
}
