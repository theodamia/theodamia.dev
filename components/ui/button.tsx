import { cva } from 'class-variance-authority';

/**
 * Almost every button on the site is a link (the one real button copies the email address), so this is a class
 * recipe rather than a component. The hover lift is Tailwind's `translate`, a property of its own, so the
 * transition has to name it: listing only `transform` leaves the lift snapping.
 */
export const buttonVariants = cva(
  'rounded-ctl inline-flex cursor-pointer items-center justify-center gap-2 border-[1.5px] font-semibold no-underline ease-soft transition-[translate,box-shadow,border-color] duration-[180ms] motion-reduce:transition-none',
  {
    variants: {
      variant: {
        /* Solid slate. One per view at most. */
        primary: 'border-ink bg-ink hover:shadow-soft text-on-ink hover:-translate-y-0.5',
        /* A white card that only firms up its border on hover. */
        quiet: 'border-line bg-card text-ink hover:border-ink',
      },
      size: {
        md: 'min-h-12 px-[22px] text-[16px]',
        sm: 'min-h-10 px-4 text-[15px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

/**
 * The quiet link: a dotted underline that turns to ink on hover, for the ways between pages and the asides under a
 * button. Inside a sentence it takes the sentence's colour and size; standing alone (`standalone`) it sets its own, a
 * step under the body.
 */
export const quietLinkVariants = cva(
  'hover:text-ink cursor-pointer font-semibold underline decoration-dotted underline-offset-4',
  {
    variants: { standalone: { true: 'text-ink-3 text-[15px]', false: '' } },
    defaultVariants: { standalone: false },
  }
);
