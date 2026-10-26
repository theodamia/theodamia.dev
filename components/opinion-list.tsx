import { TrailLink } from '@/components/trail-link';
import { quietLinkVariants } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/text';
import { holdsInWords, type Opinion } from '@/content/about';

const STEPS = 5;

/**
 * The opinions as statements, in the display face: they are convictions, so they read as sentences, each with how
 * often it holds in words and a five-step scale beside it. The scale is decoration: the words say it. An opinion
 * with a page that shows it in practice links there (the AI one, to /ai).
 */
export function OpinionList({ opinions }: { opinions: Opinion[] }) {
  return (
    <div>
      <Eyebrow as='h3'>Opinions, by how often they hold</Eyebrow>
      <ul className='border-line mt-3.5 border-b'>
        {opinions.map(opinion => {
          const { words, steps } = holdsInWords(opinion.holds);

          return (
            <li
              key={opinion.name}
              className='border-line max-wide:flex-col max-wide:gap-2 flex items-baseline justify-between gap-8 border-t py-[18px]'
            >
              <span className='font-display text-ink text-[clamp(20px,2vw,25px)] leading-[1.25] font-semibold tracking-[-0.012em] text-balance'>
                {opinion.href ? (
                  <TrailLink href={opinion.href} className={quietLinkVariants()}>
                    {opinion.name}
                  </TrailLink>
                ) : (
                  opinion.name
                )}
              </span>
              <span className='text-ink-3 inline-flex flex-none items-center gap-3 text-[14.5px] font-semibold whitespace-nowrap'>
                <span aria-hidden='true' className='inline-flex gap-[3px]'>
                  {Array.from({ length: STEPS }, (_, step) => (
                    <i
                      key={step}
                      className={
                        step < steps
                          ? 'bg-ink-2 h-1 w-3.5 rounded-xs'
                          : 'bg-line h-1 w-3.5 rounded-xs'
                      }
                    />
                  ))}
                </span>
                <span className='min-w-[8.5em]'>{words}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
