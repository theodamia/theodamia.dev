import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/** Every page, so a search engine finds /ai too: it is not in the dock, and only /about links to it. */
const PAGES = ['/', '/cv', '/about', '/ai'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(path => ({
    url: new URL(path, SITE.url).toString(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
