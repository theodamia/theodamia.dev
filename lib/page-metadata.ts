import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

type PageMeta = {
  title: string;
  description: string;
  /** Path from the root, for the canonical link and `og:url`. */
  path: string;
};

/**
 * One page's metadata, share card included.
 *
 * Next resolves `openGraph` per segment and does **not** merge it field by field: a page that sets its own replaces
 * the root's whole object, and that quietly takes the generated card (`app/opengraph-image.tsx`) with it. So every
 * page below the root is built here instead of by hand, and none of them can be shared as the home page or as a
 * bare text card again.
 */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: path,
      siteName: SITE.name,
      locale: 'en_US',
      images: ['/opengraph-image'],
    },
  };
}
