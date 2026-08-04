import { FigureCard, FigureLabel } from '@/components/figure-card';
import { EDUCATION, LANGUAGES, TRIVIA } from '@/lib/figures';

/** Fig. 7 — the margin notes: languages, degree and the things every CV insists on. */
export function MarginNotes() {
  return (
    <div className='border-ink/28 mt-[30px] grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-[26px] border-t-2 border-dashed pt-[30px]'>
      <div className='col-span-full flex flex-wrap items-baseline gap-3'>
        <FigureLabel>Fig. 7 — the margin notes</FigureLabel>
        <p className='font-hand text-ink-faint text-[18px]'>
          the stuff nobody asks about in the interview, but every CV has
        </p>
      </div>

      <FigureCard className='pb-[22px]'>
        <FigureLabel className='mb-4'>Languages</FigureLabel>
        <div className='flex flex-col gap-4'>
          {LANGUAGES.map(language => (
            <div
              key={language.name}
              className='grid [grid-template-columns:90px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-1.5'
            >
              <span className='font-hand text-ink-strong text-[21px]'>{language.name}</span>
              <div className='border-ink/75 hatch-track h-[22px] rounded-[3px] border-2'>
                <div
                  className='striped-fill h-full'
                  style={{ width: `${language.level * 100}%` }}
                />
              </div>
              <span />
              <span className='font-hand text-ink-faint text-[17px]'>{language.note}</span>
            </div>
          ))}
        </div>
      </FigureCard>

      <FigureCard className='pb-[22px]'>
        <FigureLabel className='mb-4'>Education</FigureLabel>
        <div className='border-ink/70 bg-certificate relative [transform:rotate(-0.5deg)] rounded-[4px] border-2 px-[22px] py-5'>
          <p className='text-accent font-mono text-[10px] tracking-[0.22em] uppercase'>
            {EDUCATION.kicker}
          </p>
          <p className='mt-2 font-serif text-[27px] leading-[1.15]'>{EDUCATION.subject}</p>
          <p className='text-ink-body mt-2 text-[15px] font-medium'>{EDUCATION.institution}</p>
          <p className='text-ink-faint mt-1 font-mono text-[11px] tracking-[0.1em]'>
            {EDUCATION.place}
          </p>
          <p className='text-ink-muted mt-2.5 text-[14.5px]'>{EDUCATION.note}</p>
          <p className='font-hand text-ink-faint mt-3.5 text-[17px]'>{EDUCATION.aside}</p>
        </div>
      </FigureCard>

      <FigureCard className='pb-[22px]'>
        <FigureLabel className='mb-4'>Other things CVs insist on</FigureLabel>
        <div className='flex flex-col gap-[13px]'>
          {TRIVIA.map(item => (
            <div
              key={item.label}
              className='grid [grid-template-columns:20px_minmax(0,1fr)] items-start gap-3'
            >
              <span
                aria-hidden='true'
                className='font-hand text-accent mt-px text-[21px] leading-[1.2]'
              >
                ✓
              </span>
              <div>
                <p className='text-ink-strong text-[15px] font-medium'>{item.label}</p>
                <p className='font-hand text-ink-faint mt-px text-[17px]'>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </FigureCard>
    </div>
  );
}
