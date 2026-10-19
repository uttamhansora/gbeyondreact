/** Zoptron-inspired site chrome — shared across all pages. */
export const SITE_HEADER_HTML = `
<a href="#main-content" class="skip-link">Skip to main content</a>

<header class="wnChrome" data-wn-chrome>
  <div class="wnChrome__bar">
    <a class="wnChrome__logo" href="/" aria-label="WhiteNet home">
      <img src="/assets/whitenet-logo.png" alt="" width="874" height="226" />
    </a>

    <nav class="wnChrome__nav" aria-label="Primary">
      <a class="wnChrome__link" href="/">Home</a>
      <div class="wnChrome__dropdown">
        <button type="button" class="wnChrome__link wnChrome__dropdownToggle" aria-expanded="false" aria-haspopup="true" data-wn-services-toggle>
          Services
          <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
      </div>
      <a class="wnChrome__link" href="/company">About</a>
      <a class="wnChrome__link" href="/blog">Resources</a>
      <a class="wnChrome__link" href="/case-studies">Case Studies</a>
    </nav>

    <div class="wnChrome__actions">
      <a class="wnChrome__cta" href="/contact-us">Contact Us</a>
      <button type="button" class="wnChrome__burger" aria-label="Open menu" aria-expanded="false" data-wn-burger>
        <span></span><span></span>
      </button>
    </div>
  </div>

  <div class="wnChrome__mega" data-wn-services-menu hidden>
    <div class="wnChrome__megaInner">
      <aside class="wnChrome__megaSidebar">
        <p class="wnChrome__megaEyebrow">Our Services</p>
        <h2 class="wnChrome__megaHeadline">Security Testing</h2>
        <p class="wnChrome__megaDesc">
          Application, infrastructure, and advanced assessments to find vulnerabilities before attackers do.
        </p>
        <a class="wnChrome__megaCta" href="/contact-us">Contact Us</a>
      </aside>

      <div class="wnChrome__megaColumns">
        <div class="wnChrome__megaCol">
          <h3 class="wnChrome__megaColTitle">Application</h3>
          <ul class="wnChrome__megaList">
            <li><a href="/web-app-penetration-testing">Web App Penetration Testing</a></li>
            <li><a href="/web-app-penetration-testing">Mobile App Security Testing</a></li>
            <li><a href="/web-app-penetration-testing">API Penetration Testing</a></li>
            <li><a href="/web-app-penetration-testing">Source Code Review</a></li>
          </ul>
        </div>
        <div class="wnChrome__megaCol">
          <h3 class="wnChrome__megaColTitle">Infrastructure</h3>
          <ul class="wnChrome__megaList">
            <li><a href="/network-security-assessment">Network Security Assessment</a></li>
            <li><a href="/network-security-assessment">Cloud Security Testing</a></li>
            <li><a href="/network-security-assessment">Wireless Security Testing</a></li>
            <li><a href="/network-security-assessment">IoT Security Testing</a></li>
          </ul>
        </div>
        <div class="wnChrome__megaCol">
          <h3 class="wnChrome__megaColTitle">Advanced</h3>
          <ul class="wnChrome__megaList">
            <li><a href="/network-security-assessment">Red Team Assessment</a></li>
            <li><a href="/network-security-assessment">VAPT Services</a></li>
            <li><a href="/network-security-assessment">Compliance Security Audit</a></li>
            <li><a href="/network-security-assessment">Social Engineering Testing</a></li>
            <li><a href="/network-security-assessment">Managed Security Services</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="wnChrome__drawer" data-wn-drawer hidden>
    <nav class="wnChrome__drawerNav" aria-label="Mobile">
      <a href="/">Home</a>
      <details class="wnChrome__drawerDetails">
        <summary>Services</summary>
        <div class="wnChrome__drawerGroup">
          <p class="wnChrome__drawerGroupLabel">Application</p>
          <a href="/web-app-penetration-testing">Web App Penetration Testing</a>
          <a href="/mobile-app-security-testing">Mobile App Security Testing</a>
          <a href="/api-penetration-testing">API Penetration Testing</a>
          <a href="/source-code-review">Source Code Review</a>
          <p class="wnChrome__drawerGroupLabel">Infrastructure</p>
          <a href="/network-security-assessment">Network Security Assessment</a>
          <a href="/cloud-security-testing">Cloud Security Testing</a>
          <a href="/wireless-security-testing">Wireless Security Testing</a>
          <a href="/iot-security-testing">IoT Security Testing</a>
          <p class="wnChrome__drawerGroupLabel">Advanced</p>
          <a href="/red-team-assessment">Red Team Assessment</a>
          <a href="/vapt-services">VAPT Services</a>
          <a href="/compliance-security-audit">Compliance Security Audit</a>
          <a href="/social-engineering-testing">Social Engineering Testing</a>
          <a href="/managed-security-services">Managed Security Services</a>
        </div>
      </details>
      <a href="/company">About</a>
      <a href="/blog">Resources</a>
      <a href="/case-studies">Case Studies</a>
      <a href="/contact-us">Contact Us</a>
    </nav>
  </div>
</header>
`;
