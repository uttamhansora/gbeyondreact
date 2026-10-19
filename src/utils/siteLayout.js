/**
 * Splits an exported page into its three page-level regions.  The source pages
 * are snapshots of a Vue-powered site, so the markup must remain in the same
 * mount point for its custom elements to initialise correctly.
 */
import { SITE_HEADER_HTML } from '../partials/siteHeader.js';
import { SITE_FOOTER_HTML } from '../partials/siteFooter.js';

const MAIN_START = '<main id="main-content" role="main">';
const FOOTER_START = '<footer class="siteFooter">';

export function splitSiteLayout(html) {
  const mainStart = html.indexOf(MAIN_START);
  const footerStart = html.indexOf(FOOTER_START);

  if (mainStart === -1 || footerStart === -1 || footerStart <= mainStart) {
    throw new Error('Page markup is missing the expected header, main content, or footer.');
  }

  return {
    header: html.slice(0, mainStart),
    main: html.slice(mainStart, footerStart),
    footer: html.slice(footerStart),
  };
}

export function composeSiteLayout({ main }) {
  // Shared chrome replaces the legacy scraped header and duplicated footers.
  return `${SITE_HEADER_HTML}${main}${SITE_FOOTER_HTML}`;
}
