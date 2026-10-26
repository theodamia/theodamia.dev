import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

/** Everyone may read every page, AI search crawlers included: the site is a CV, it wants to be found. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: new URL('/sitemap.xml', SITE.url).toString(),
  };
}
