import { describe, expect, it } from 'vitest';
import { JOBS } from '@/content/jobs';
import { SITE } from '@/content/site';
import { personSchema } from '@/lib/person-schema';

const schema = personSchema();

describe('personSchema', () => {
  it('ties the site to the profiles, which is the part sourcing tools read', () => {
    expect(schema.sameAs).toEqual([SITE.linkedin.url, SITE.github.url]);
    expect(schema.name).toBe(SITE.name);
    expect(schema.jobTitle).toBe(SITE.title);
  });

  it('names the present employer, the one at the top of the climb', () => {
    const now = JOBS[JOBS.length - 1];
    expect(schema.worksFor).toEqual({
      '@type': 'Organization',
      name: now.company,
      url: now.url,
    });
  });

  /*
   * The three below are read out of sentences written for people, so a reword could quietly empty them. Each is
   * asserted for shape rather than for its exact words, which would only pin the copy in a second place.
   */
  it('splits the location into the two halves schema.org asks for', () => {
    expect(schema.address.addressLocality).toBeTruthy();
    expect(schema.address.addressCountry).toBeTruthy();
    expect(`${schema.address.addressLocality}, ${schema.address.addressCountry}`).toBe(
      SITE.location
    );
  });

  it('keeps the languages and drops how well they are spoken', () => {
    expect(schema.knowsLanguage.length).toBeGreaterThan(0);
    schema.knowsLanguage.forEach(language => expect(language).not.toMatch(/[()]/));
  });

  it('finds a school rather than the whole degree line', () => {
    expect(schema).toHaveProperty('alumniOf');
    expect((schema as { alumniOf: { name: string } }).alumniOf.name).not.toMatch(/BSc/);
  });
});
