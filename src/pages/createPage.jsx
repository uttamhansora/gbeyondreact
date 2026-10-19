import HtmlPage from '../components/HtmlPage.jsx';
import { replaceCanonicalSiteUrls } from '../utils/siteUrl.js';
import pageManifest from './content/manifest.json';
import indexHtml from './content/index.html?raw';
import blogHtml from './content/blog.html?raw';
import blogFociHtml from './content/blog-how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch.html?raw';
import caseStudiesHtml from './content/case-studies.html?raw';
import companyHtml from './content/company.html?raw';
import contactUsHtml from './content/contact-us.html?raw';
import microsoftAssessmentsHtml from './content/microsoft-assessments.html?raw';
import ManagedDetectionAndResponse from './content/web-app-penetration-testing.html?raw';

import MobileAppSecurityTesting from './content/mobile-app-security-testing.html?raw';
import ApiPenetrationTesting from './content/api-penetration-testing.html?raw';
import SourceCodeReview from './content/source-code-review.html?raw';
import NetworkSecurityAssessment from './content/network-security-assessment.html?raw';
import CloudSecurityTesting from './content/cloud-security-testing.html?raw';
import WirelessSecurityTesting from './content/wireless-security-testing.html?raw';
import IotSecurityTesting from './content/iot-security-testing.html?raw';
import RedTeamAssessment from './content/red-team-assessment.html?raw';
import VaptServices from './content/vapt-services.html?raw';
import ComplianceSecurityAudit from './content/compliance-security-audit.html?raw';
import SocialEngineeringTesting from './content/social-engineering-testing.html?raw';
import ManagedSecurityServices from './content/managed-security-services.html?raw';

const latestInsightsHtml = `
<section class="layer -darkBackground relatedEntries">
  <div class="grid relatedEntries__grid">
    <div class="relatedEntries__contentWrapper">
      <header class="relatedEntries__header">
        <div class="relatedEntries__headerContent"><h2 class="relatedEntries__headline">Latest Insights</h2></div>
        <div class="relatedEntries__headerButtons">
          <button class="relatedEntries__headerButton arrowButton -previous" data-slider-prev aria-label="Previous insights"><svg class="relatedEntries__toggleArrow" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(28 0) scale(-1 1)"><rect x="0.625" y="0.625" width="26.75" height="26.75" rx="13.375" stroke="currentColor" stroke-width="1.25" fill="none"/><path d="M20.3568 14.2286C20.6009 13.9845 20.6009 13.5888 20.3568 13.3447L16.3793 9.3672C16.1353 9.12313 15.7395 9.12313 15.4955 9.3672C15.2514 9.61128 15.2514 10.007 15.4955 10.2511L19.031 13.7866L15.4955 17.3222C15.2514 17.5662 15.2514 17.962 15.4955 18.206C15.7395 18.4501 16.1353 18.4501 16.3793 18.206L20.3568 14.2286ZM7.66016 13.7866L7.66016 14.4116L19.9149 14.4116L19.9149 13.7866L19.9149 13.1616L7.66016 13.1616L7.66016 13.7866Z" fill="currentColor"/></g></svg></button>
          <button class="relatedEntries__headerButton arrowButton -next" data-slider-next aria-label="Next insights"><svg class="relatedEntries__toggleArrow" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><rect x="0.625" y="0.625" width="26.75" height="26.75" rx="13.375" stroke="currentColor" stroke-width="1.25" fill="none"/><path d="M20.3568 14.2286C20.6009 13.9845 20.6009 13.5888 20.3568 13.3447L16.3793 9.3672C16.1353 9.12313 15.7395 9.12313 15.4955 9.3672C15.2514 9.61128 15.2514 10.007 15.4955 10.2511L19.031 13.7866L15.4955 17.3222C15.2514 17.5662 15.2514 17.962 15.4955 18.206C15.7395 18.4501 16.1353 18.4501 16.3793 18.206L20.3568 14.2286ZM7.66016 13.7866L7.66016 14.4116L19.9149 14.4116L19.9149 13.7866L19.9149 13.1616L7.66016 13.1616L7.66016 13.7866Z" fill="currentColor"/></g></svg></button>
        </div>
      </header>
      <div class="wnInsights" data-wn-insights>
        <div class="wnInsights__viewport">
          <div class="wnInsights__track">
            <div class="wnInsights__slide"><div class="relatedEntries__card card -dark"><div class="card__imageWrapper -fullWidth -cobaltAccent"><img class="card__image" src="https://whitenet.io/wp-content/uploads/2026/06/Strengthening-Security-for-a-Multi-Tenant-SaaS-App-Builder-Through-Web-API-Penetration-Testing.png" alt="Multi-tenant SaaS app builder web and API penetration testing" /></div><article class="card__article"><p class="card__eyebrow">Blog</p><h5 class="card__title"><a class="card__link -cover" href="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch">Strengthening Security for a Multi-Tenant SaaS App Builder Through Web &amp; API Penetration Testing</a></h5><div class="card__actions"><a href="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch" class="card__action">Read now</a></div></article></div></div>
            <div class="wnInsights__slide"><div class="relatedEntries__card card -dark"><div class="card__imageWrapper -fullWidth -cobaltAccent"><img class="card__image" src="https://whitenet.io/wp-content/uploads/2026/06/ChatGPT-Image-Jun-29-2026-10_26_03-PM.png" alt="Web application penetration testing before a product launch" /></div><article class="card__article"><p class="card__eyebrow">Blog</p><h5 class="card__title"><a class="card__link -cover" href="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch">How a Web Application Pentest Uncovered Critical Vulnerabilities Before a Major Product Launch</a></h5><div class="card__actions"><a href="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch" class="card__action">Read now</a></div></article></div></div>
            <div class="wnInsights__slide"><div class="relatedEntries__card card -dark"><div class="card__imageWrapper -fullWidth -cobaltAccent"><img class="card__image" src="https://whitenet.io/wp-content/uploads/2024/10/Post-5.jpg" alt="How to create a business plan that drives" /></div><article class="card__article"><p class="card__eyebrow">Blog</p><h5 class="card__title"><a class="card__link -cover" href="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch">How to Create a Business Plan That Drives</a></h5><div class="card__actions"><a href="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch" class="card__action">Read now</a></div></article></div></div>
          </div>
        </div>
        <div class="wnInsightsDots" data-wn-insights-dots role="tablist" aria-label="Latest insights"></div>
      </div>
    </div>
  </div>
</section>`;

function replaceLatestInsights(html) {
  return html.replace(
    /<section class="layer -darkBackground\s+relatedEntries"[\s\S]*?<\/section>(?=<section class="layer -backgroundImage -noPadding lazyload")/,
    latestInsightsHtml,
  );
}

const clientLogoItems = `<span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="/assets/client-logos/formbricks.png" alt="Formbricks" /></span><span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="/assets/client-logos/trendemon.png" alt="TrenDemon" /></span><span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="/assets/client-logos/shippit.png" alt="Shippit" /></span><span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="/assets/client-logos/indeed.png" alt="Indeed" /></span><span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="/assets/client-logos/kavanu.png" alt="Kavanu" /></span><span class="wnClientLogoItem"><img class="wnDummyClients__logo" src="/assets/client-logos/eclincher.png" alt="Eclincher" /></span><span class="wnClientLogoItem"><span class="wnDummyClients__wordmark" aria-label="FIS Global">FIS</span></span>`;

const homepageClientLogosHtml = `<div class="logoTestimonialSlider__logoSlider"><div class="wnDummyClients" aria-label="Client logos"><div class="wnClientLogoTrack"><div class="wnClientLogoSet">${clientLogoItems}</div><div class="wnClientLogoSet" aria-hidden="true">${clientLogoItems.replaceAll(' alt=', ' data-alt=')}</div></div></div></div>`;

function replaceHomepageClientLogos(html) {
  const start = html.indexOf('<div class="logoTestimonialSlider__logoSlider">');
  if (start === -1) return html;

  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let match;

  while ((match = tags.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) {
      return `${html.slice(0, start)}${homepageClientLogosHtml}${html.slice(tags.lastIndex)}`;
    }
  }

  return html;
}


const htmlByName = {
  index: indexHtml,
  blog: blogHtml,
  'blog-how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch': blogFociHtml,
  'case-studies': caseStudiesHtml,
  company: companyHtml,
  'contact-us': contactUsHtml,
  'microsoft-assessments': microsoftAssessmentsHtml,
  'web-app-penetration-testing' : ManagedDetectionAndResponse,
  'mobile-app-security-testing': MobileAppSecurityTesting,
'api-penetration-testing': ApiPenetrationTesting,
'source-code-review': SourceCodeReview,
'network-security-assessment': NetworkSecurityAssessment,
'cloud-security-testing': CloudSecurityTesting,
'wireless-security-testing': WirelessSecurityTesting,
'iot-security-testing': IotSecurityTesting,
'red-team-assessment': RedTeamAssessment,
'vapt-services': VaptServices,
'compliance-security-audit': ComplianceSecurityAudit,
'social-engineering-testing': SocialEngineeringTesting,
'managed-security-services': ManagedSecurityServices,
};

export function createPage(name) {
  const meta = pageManifest.find((page) => page.name === name);
  const html = name === 'index'
    ? replaceHomepageClientLogos(replaceLatestInsights(htmlByName.index))
    : htmlByName[name] ?? '';

  if (!meta) {
    throw new Error(`Missing page metadata for "${name}"`);
  }

  const pageHtml = replaceCanonicalSiteUrls(html);
  const pageLdJson = meta.ldJson ? replaceCanonicalSiteUrls(meta.ldJson) : meta.ldJson;

  return function Page() {
    return (
      <HtmlPage
        bodyClass={meta.bodyClass}
        title={meta.title}
        description={meta.description}
        ldJson={pageLdJson}
        html={pageHtml}
      />
    );
  };
}
