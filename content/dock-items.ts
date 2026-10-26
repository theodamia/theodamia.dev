export type DockItemId = 'home' | 'cv' | 'about' | 'contact';

export type DockItem = {
  id: DockItemId;
  /** Shown in the bubble, spelled out on touch screens and used as the accessible name. */
  label: string;
  /** Route the target lives on. */
  page: '/' | '/cv' | '/about' | '/ai';
  /** Element id on that page; none means the top of the page. */
  section?: string;
};

/**
 * The dock is the only navigation and works on every page: the three pages, then the one action. Sections are
 * reached by reading on, so Skills is not here: it is part of /about, not a place of its own. /ai is not here
 * either: it is sent as a link, or reached from /about.
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

/** Pages that end on a Contact card of their own (`id='contact'`). */
const OWN_CONTACT: ReadonlySet<string> = new Set(['/cv', '/about', '/ai']);

/**
 * An item as it works from `pathname`. Contact goes to the page's own card where the page has one, so the reader
 * is not taken off a page that already ends on it; elsewhere (the climb, the 404) it goes to /about's.
 */
export function dockItemOn(item: DockItem, pathname: string): DockItem {
  if (item.id !== 'contact' || !OWN_CONTACT.has(pathname)) return item;

  return { ...item, page: pathname as DockItem['page'] };
}

/** The item's `href`, and what the dock compares against to know it is already on that page (`/about#contact`). */
export function dockHref(item: DockItem): string {
  return item.section ? `${item.page}#${item.section}` : item.page;
}
