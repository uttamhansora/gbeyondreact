/** Canonical origin baked into scraped Whitenet HTML/JSON. */
export const DEFAULT_SITE_ORIGIN = 'https://www.whitenet.com';

const CANONICAL_HOST_PATTERN = /https?:\/\/www\.whitenet\.com/gi;
const CANONICAL_PROTOCOL_RELATIVE_PATTERN = /\/\/www\.whitenet\.com/gi;

export function normalizeSiteBaseUrl(raw) {
  const value = (raw ?? '').trim();
  if (!value) {
    return DEFAULT_SITE_ORIGIN;
  }

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
}

/** Site origin from Vite env (`VITE_SITE_BASE_URL`). */
export function getSiteBaseUrl() {
  return normalizeSiteBaseUrl(import.meta.env.VITE_SITE_BASE_URL);
}

/**
 * Rewrites absolute links to www.whitenet.com to the configured site base URL.
 * Does not change other hosts (e.g. portal.whitenet.com, S3 asset URLs).
 */
export function replaceCanonicalSiteUrls(content, baseUrl) {
  if (content == null || content === '') {
    return content;
  }

  const text = typeof content === 'string' ? content : String(content);
  const targetOrigin = normalizeSiteBaseUrl(
    baseUrl ?? (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SITE_BASE_URL : undefined),
  );

  if (targetOrigin === DEFAULT_SITE_ORIGIN) {
    return text;
  }

  const targetHost = new URL(targetOrigin).host;

  return text
    .replace(CANONICAL_HOST_PATTERN, targetOrigin)
    .replace(CANONICAL_PROTOCOL_RELATIVE_PATTERN, `//${targetHost}`);
}
