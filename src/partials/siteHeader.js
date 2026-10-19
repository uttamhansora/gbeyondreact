/** Legency-inspired site chrome — shared across all pages. */
export const SITE_HEADER_HTML = `
<a href="#main-content" class="skip-link">Skip to main content</a>

<header class="wnChrome wnChrome--legency" data-wn-chrome>
  <div class="wnChrome__bar">
    <a class="wnChrome__logo" href="/" aria-label="WhiteNet home">
      <img src="/assets/whitenet-logo.png" alt="WhiteNet" width="874" height="226" />
    </a>

    <button type="button" class="wnChrome__burger" aria-label="Open menu" aria-expanded="false" data-wn-burger>
      <span></span><span></span>
      <em>Menu</em>
    </button>
  </div>

  <div class="wnChrome__panel" data-wn-menu-panel aria-hidden="true">
    <div class="wnChrome__panelHead">
      <p class="wnChrome__panelEyebrow">Menu</p>
      <button type="button" class="wnChrome__panelClose" aria-label="Close menu" data-wn-menu-close>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
      </button>
    </div>

    <div class="wnChrome__panelGrid">
      <nav class="wnChrome__siteNav" aria-label="Site">
        <p class="wnChrome__panelLabel">Site</p>
        <a href="/">Home</a>
        <a href="/company">About</a>
        <a href="/case-studies">Case Studies</a>
        <a href="/blog">Resources</a>
        <a href="/contact-us">Contact Us</a>
      </nav>

      <div class="wnChrome__servicesAcc" data-wn-services-acc>
        <p class="wnChrome__panelLabel">Services</p>

        <details class="wnChrome__accItem" open>
          <summary class="wnChrome__accSummary">
            <span class="wnChrome__accTitle">Application Security</span>
            <span class="wnChrome__accIcon" aria-hidden="true"></span>
          </summary>
          <div class="wnChrome__accBody">
            <p class="wnChrome__accBlurb">Find and fix vulnerabilities in the software your customers rely on every day.</p>
            <ul class="wnChrome__accLinks">
              <li><a href="/web-app-penetration-testing">Web App Penetration Testing</a></li>
              <li><a href="/mobile-app-security-testing">Mobile App Security Testing</a></li>
              <li><a href="/api-penetration-testing">API Penetration Testing</a></li>
              <li><a href="/source-code-review">Source Code Review</a></li>
            </ul>
          </div>
        </details>

        <details class="wnChrome__accItem">
          <summary class="wnChrome__accSummary">
            <span class="wnChrome__accTitle">Infrastructure Security</span>
            <span class="wnChrome__accIcon" aria-hidden="true"></span>
          </summary>
          <div class="wnChrome__accBody">
            <p class="wnChrome__accBlurb">Test networks, cloud tenants, and connected devices against real-world attack paths.</p>
            <ul class="wnChrome__accLinks">
              <li><a href="/network-security-assessment">Network Security Assessment</a></li>
              <li><a href="/cloud-security-testing">Cloud Security Testing</a></li>
              <li><a href="/wireless-security-testing">Wireless Security Testing</a></li>
              <li><a href="/iot-security-testing">IoT Security Testing</a></li>
            </ul>
          </div>
        </details>

        <details class="wnChrome__accItem">
          <summary class="wnChrome__accSummary">
            <span class="wnChrome__accTitle">Advanced Assessments</span>
            <span class="wnChrome__accIcon" aria-hidden="true"></span>
          </summary>
          <div class="wnChrome__accBody">
            <p class="wnChrome__accBlurb">Adversary-simulation and compliance programs for teams that need proof, not promises.</p>
            <ul class="wnChrome__accLinks">
              <li><a href="/red-team-assessment">Red Team Assessment</a></li>
              <li><a href="/vapt-services">VAPT Services</a></li>
              <li><a href="/compliance-security-audit">Compliance Security Audit</a></li>
              <li><a href="/social-engineering-testing">Social Engineering Testing</a></li>
              <li><a href="/managed-security-services">Managed Security Services</a></li>
            </ul>
          </div>
        </details>
      </div>
    </div>

    <div class="wnChrome__panelFoot">
      <a class="wnChrome__bubbleCta" href="/contact-us">
        Book a Demo
        <span class="wnChrome__bubbleArrow" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>
    </div>
  </div>
</header>
`;
