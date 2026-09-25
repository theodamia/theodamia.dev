import { EDUCATION, FACTS } from '@/content/about';
import { JOBS } from '@/content/jobs';
import { SITE } from '@/content/site';

/** The last job in `content/jobs.ts` is the present one, the same way the altimeter reads it. */
const CURRENT = JOBS[JOBS.length - 1];

/** `Thessaloniki, Greece` → the two halves schema.org asks for separately. */
const [CITY, COUNTRY] = SITE.location.split(', ');

/** `BSc Computer Science, TEI of Central Macedonia` → the school is what follows the degree. */
const SCHOOL = EDUCATION?.value.split(', ').at(-1);

/** `Greek (native), English (fluent)` → just the languages; how well is not part of the vocabulary. */
const LANGUAGES = (FACTS.find(fact => fact.label === 'Languages')?.value ?? '')
  .split(', ')
  .map(entry => entry.replace(/\s*\(.*\)$/, ''))
  .filter(Boolean);

/**
 * The site's identity in the vocabulary search engines and sourcing tools read, since everything a person gets
 * from the prose a machine has to infer. `sameAs` matters most: it ties this domain to the LinkedIn and GitHub
 * accounts rather than leaving three unconnected profiles of a common name.
 *
 * Derived from `content/` so it cannot drift. Tests pin the derivations, two of which read a shape out of a
 * sentence someone may one day reword.
 */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    jobTitle: SITE.title,
    email: `mailto:${SITE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: CITY, addressCountry: COUNTRY },
    worksFor: { '@type': 'Organization', name: CURRENT.company, url: CURRENT.url },
    ...(SCHOOL ? { alumniOf: { '@type': 'CollegeOrUniversity', name: SCHOOL } } : {}),
    knowsLanguage: LANGUAGES,
    sameAs: [SITE.linkedin.url, SITE.github.url],
  };
}
