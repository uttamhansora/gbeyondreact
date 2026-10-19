import indexPageHtml from '../pages/content/index.html?raw';

/**
 * The exported source pages include their own scraped footer. Keep a single
 * canonical footer here so changes are applied consistently across every
 * route.
 */
const FOOTER_START = '<footer class="siteFooter">';
const footerStart = indexPageHtml.indexOf(FOOTER_START);

if (footerStart === -1) {
  throw new Error('The shared site footer could not be found.');
}

export const SITE_FOOTER_HTML = indexPageHtml.slice(footerStart);
