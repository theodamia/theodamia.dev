import { cva } from 'class-variance-authority';

/** Every button on the site is a link, so this is a class recipe rather than a component. */
export const buttonVariants = cva(
  'rounded-ctl inline-flex cursor-pointer items-center justify-center gap-2 border-[1.5px] font-semibold no-underline transition-[transform,box-shadow,border-color] duration-[180ms] motion-reduce:transition-none',
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
