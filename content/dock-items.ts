export type DockItemId = 'home' | 'cv' | 'about' | 'contact';

export type DockItem = {
  id: DockItemId;
  /** Shown in the bubble, spelled out on touch screens and used as the accessible name. */
  label: string;
  /** Route the target lives on. */
  page: '/' | '/cv' | '/about';
  /** Element id on that page; none means the top of the page. */
  section?: string;
};

/**
 * The dock is the only navigation and works across all three pages: the three pages, then the one action. Sections
 * are reached by reading on, so Skills is not here: it is part of /about, not a place of its own.
 */
export const DOCK_ITEMS: DockItem[] = [
  { id: 'home', label: 'Home', page: '/' },
  { id: 'cv', label: 'Experience', page: '/cv' },
  { id: 'about', label: 'About', page: '/about' },
  { id: 'contact', label: 'Contact', page: '/about', section: 'contact' },
];

/** What the dock calls a place: a page's header names it in the same word, so the two never disagree. */
export function dockLabel(id: DockItemId): string {
  return DOCK_ITEMS.find(item => item.id === id)?.label ?? id;
}

/** The item's `href`, and what the dock compares against to know it is already on that page (`/about#skills`). */
export function dockHref(item: DockItem): string {
  return item.section ? `${item.page}#${item.section}` : item.page;
}
