import { STATS } from '@/lib/figures';

export function StatRow() {
  return (
    <div className='mt-[30px] grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-[18px]'>
      {STATS.map(stat => (
        <div key={stat.label} className='border-ink/30 rounded-[4px] border border-dashed p-5'>
          <p className='font-hand text-accent text-[46px] leading-none'>{stat.value}</p>
          <p className='text-ink-muted mt-1 text-[14px]'>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
