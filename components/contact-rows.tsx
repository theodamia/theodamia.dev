import { Eyebrow } from '@/components/ui/text';
import { SITE } from '@/lib/site';

const CHANNELS = [
  { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, external: false },
  { label: 'LinkedIn', value: SITE.linkedin.handle, href: SITE.linkedin.url, external: true },
  { label: 'GitHub', value: SITE.github.handle, href: SITE.github.url, external: true },
];

export function ContactRows() {
  return (
    <ul className='mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3'>
      {CHANNELS.map(channel => (
        <li key={channel.label}>
          <a
            href={channel.href}
            {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className='rounded-inner border-line bg-tint text-ink hover:border-ink flex min-h-[68px] items-center justify-between gap-3.5 border px-5 py-3 font-semibold transition-[border-color,transform] duration-[180ms] hover:-translate-y-0.5 motion-reduce:transition-none'
          >
            <span className='min-w-0 break-words'>
              <Eyebrow className='block'>{channel.label}</Eyebrow>
              {channel.value}
            </span>
            <span aria-hidden='true'>{channel.external ? '↗' : '→'}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
