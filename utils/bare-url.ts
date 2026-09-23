/**
 * A URL the way a CV prints it: no protocol, no `www.`, no trailing slash, so `https://www.linkedin.com/in/x/`
 * reads as `linkedin.com/in/x`. Short enough for one line on paper, and still exact enough to type back in.
 */
export function bareUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}
