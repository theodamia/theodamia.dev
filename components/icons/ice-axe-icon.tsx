import { DockIcon, type IconProps } from '@/components/icons/dock-icon';

/** Skills: an ice axe — curved pick, adze, long shaft. */
export function IceAxeIcon(props: IconProps) {
  return (
    <DockIcon {...props}>
      <path d='M6.5 21 15.5 6.5' />
      <path d='M15.5 6.5C12.5 3.8 7.5 2.8 3.5 7.5' />
      <path d='m15.5 6.5 3.3 2' />
      <path d='m17.6 10.5 2.3-3.9' />
    </DockIcon>
  );
}
