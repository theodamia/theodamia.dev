'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

/** How long the button says "Copied" before it goes back to "Copy". */
const COPIED_FOR_MS = 2000;
const ICON_SIZE = 16;

/**
 * Copies the address, for anyone without a mail app set up. The label turns to "Copied" for a moment; a screen
 * reader hears it through the status line. If the clipboard is not available nothing happens: the address is on
 * the page to select.
 */
export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_FOR_MS);
  }

  const Icon = copied ? Check : Copy;

  return (
    <>
      <button
        type='button'
        onClick={copy}
        aria-label='Copy email address'
        className={cn(buttonVariants({ variant: 'quiet', size: 'sm' }), className)}
      >
        <Icon size={ICON_SIZE} aria-hidden='true' />
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span role='status' className='sr-only'>
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  );
}
