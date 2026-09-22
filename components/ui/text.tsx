import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/** The display scale: hero and page for the two titles, section and card inside them, sub for a block's heading. */
const headingVariants = cva('font-display font-semibold text-ink', {
  variants: {
    size: {
      hero: 'text-[clamp(44px,6.6vw,84px)] leading-none tracking-[-0.025em]',
      page: 'text-[clamp(42px,5.6vw,72px)] leading-none tracking-[-0.025em]',
      section: 'text-[clamp(32px,4vw,46px)] leading-[1.06] tracking-[-0.02em]',
      card: 'text-[26px] leading-[1.15] tracking-[-0.015em]',
      sub: 'text-[22px] leading-[1.2] tracking-[-0.015em]',
    },
  },
  defaultVariants: { size: 'section' },
});

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & { as?: 'h1' | 'h2' | 'h3' };

/** Every heading on the site. The tag and the size are chosen separately: order in the page, then weight on it. */
export function Heading({ as: Tag = 'h2', size, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />;
}

/** The sentence under a page's title: one size up from the body, and never wider than a comfortable line. */
export function Lede({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-ink-2 max-wide:max-w-full max-wide:text-[18px] mt-[18px] max-w-[480px] text-[19px] text-pretty',
        className
      )}
      {...props}
    />
  );
}

/** The small grey line above a heading, and every other quiet caption. */
export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-ink-3 text-[14.5px] leading-[1.4] font-semibold', className)}
      {...props}
    />
  );
}
