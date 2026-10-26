import { Eyebrow, Heading } from '@/components/ui/text';
import { cn } from '@/utils/cn';

/** One entry of a log: a date line, what it was, where, one sentence and its points. */
export type LogItem = {
  /** The id its heading takes, so the entry is named by it. */
  id: string;
  /** The date line, as it reads: "Mar 2026 – present · 7 months". */
  when: string;
  title: string;
  place: string;
  /** The place's site; the place's name links there when it has one. */
  url?: string;
  summary: string;
  points: string[];
};

type LogEntryProps = {
  entry: LogItem;
  /**
   * Its heading's level: 2 where entries are the page's sections (/cv's log), 3 inside a section of their own
   * (/ai). The "What I did" label is one level under it.
   */
  level?: 2 | 3;
  className?: string;
};

/**
 * One entry in a log: /cv's field log of every job, /ai's places. Open text on a hairline, not a card: the date
 * line, the title, the place, one sentence and what I did, all at once. The climb carries the jobs on cards
 * (job-card.tsx); this is the plain reading of them, which is /cv's identity. The `<li>` around it, and on /cv
 * the rail and the node, are the page's, as each page owns the stop around its entry.
 */
export function LogEntry({ entry, level = 2, className }: LogEntryProps) {
  const Label = level === 2 ? 'h3' : 'h4';

  return (
    <article
      aria-labelledby={entry.id}
      className={cn(
        'border-line border-t pt-7 pb-9 print:border-t-0 print:pt-5 print:pb-1',
        className
      )}
    >
      <Eyebrow>{entry.when}</Eyebrow>
      <Heading
        as={level === 2 ? 'h2' : 'h3'}
        size='card'
        id={entry.id}
        className='max-wide:text-[22px] mt-2'
      >
        {entry.title}
      </Heading>
      <p className='text-ink-2 mt-1.5 text-[15.5px] leading-[1.4] font-semibold'>
        {entry.url ? (
          <a
            href={entry.url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-ink underline-offset-4 hover:underline'
          >
            {entry.place} <span aria-hidden='true'>↗</span>
            <span className='sr-only'>(opens in a new tab)</span>
          </a>
        ) : (
          entry.place
        )}
      </p>
      <p className='text-ink-2 mt-3 max-w-[60ch] text-[16.5px] leading-[1.55] text-pretty'>
        {entry.summary}
      </p>
      <Label className='text-ink-3 mt-[18px] text-[14px] leading-[1.4] font-semibold'>
        What I did
      </Label>
      <ul className='mt-2 flex flex-col gap-1.5'>
        {entry.points.map(point => (
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
