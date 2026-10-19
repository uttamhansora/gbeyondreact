import { useEffect, useRef } from 'react';
import { mountSiteHtml } from '../utils/initSite.js';
import { composeSiteLayout, splitSiteLayout } from '../utils/siteLayout.js';

function decodeHtmlEntities(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

export default function HtmlPage({ bodyClass, title, description, ldJson, html }) {
  const ldJsonRef = useRef(null);
  const layout = splitSiteLayout(html);
  const pageHtml = composeSiteLayout({ main: layout.main });

  useEffect(() => {
    document.body.className = bodyClass || '';
    document.title = title || '';

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', decodeHtmlEntities(description));
    }

    window.scrollTo(0, 0);
  }, [bodyClass, title, description]);

  useEffect(() => {
    if (!ldJson) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = ldJson;
    document.body.appendChild(script);
    ldJsonRef.current = script;

    return () => {
      if (ldJsonRef.current?.parentNode) {
        ldJsonRef.current.parentNode.removeChild(ldJsonRef.current);
      }
      ldJsonRef.current = null;
    };
  }, [ldJson]);

  useEffect(() => {
    mountSiteHtml(pageHtml);
  }, [pageHtml]);

  return null;
}
