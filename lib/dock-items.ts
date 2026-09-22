export type DockItemId = 'home' | 'climb' | 'about' | 'skills' | 'contact';

export type DockItem = {
  id: DockItemId;
  /** Shown in the bubble, spelled out on touch screens and used as the accessible name. */
  label: string;
  /** Route the target lives on. */
  page: '/' | '/about';
  /** Element id on that page; none means the top of the page. */
  section?: string;
};

/** The dock is the only navigation and works across both pages. */
export const DOCK_ITEMS: DockItem[] = [
  { id: 'home', label: 'Home', page: '/' },
  { id: 'climb', label: 'Experience', page: '/', section: 'climb' },
  { id: 'about', label: 'About', page: '/about', section: 'about' },
  { id: 'skills', label: 'Skills', page: '/about', section: 'skills' },
  { id: 'contact', label: 'Contact', page: '/about', section: 'contact' },
];

/** The item's `href`, and what the dock compares against to know it is already on that page (`/about#skills`). */
export function dockHref(item: DockItem): string {
  return item.section ? `${item.page}#${item.section}` : item.page;
}
