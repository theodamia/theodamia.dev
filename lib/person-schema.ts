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
 * The site's own identity, in the vocabulary search engines and recruiter sourcing tools read. Everything a human
 * reader gets from the hero and /about is in the prose, where a machine has to infer it; this states it outright,
 * and `sameAs` is the part that matters most — it is what ties this domain to the LinkedIn and GitHub accounts
 * rather than leaving three unconnected profiles of a common-enough name.
 *
 * Every value is derived from `content/`, so it cannot drift from the page it describes. A test pins the
 * derivations, because two of them read a shape out of a sentence that someone may one day reword.
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
