/** Legency-inspired site chrome — shared across all pages.
 *  Two-step expanding nav card: collapsed bar (logo + Menu) grows into a
 *  white panel with a Site column, grouped Services mega-menu and CTAs. */
export const SITE_HEADER_HTML = `
<a href="#main-content" class="skip-link">Skip to main content</a>

<header class="wnChrome wnChrome--legency" data-wn-chrome>
  <div class="wnLgNav" data-wn-nav>
    <div class="wnLgNav__bg" data-wn-nav-close aria-hidden="true"></div>

    <div class="wnLgNav__bar" data-nav-status="not-active">
      <div class="wnLgNav__top">
        <a class="wnLgNav__logo" href="/" aria-label="WhiteNet home">
          <img src="/assets/whitenet-logo.png" alt="WhiteNet" width="874" height="226" />
        </a>

        <button type="button" class="wnLgNav__toggle" data-wn-nav-toggle aria-expanded="false" aria-controls="wn-nav-panel" aria-label="Open menu">
          <span class="wnLgNav__toggleIcon" aria-hidden="true">
            <i class="wnLgNav__toggleBar"></i>
            <i class="wnLgNav__toggleBar"></i>
          </span>
          <span class="wnLgNav__toggleWords" aria-hidden="true">
            <span class="wnLgNav__toggleWord -menu">Menu</span>
            <span class="wnLgNav__toggleWord -close">Close</span>
          </span>
        </button>

        <a class="wnLgNav__cta" href="/contact-us">Get in Touch</a>
        <span class="wnLgNav__topLine" aria-hidden="true"></span>
      </div>

      <div class="wnLgNav__bottom" id="wn-nav-panel">
        <div class="wnLgNav__bottomOverflow">
          <div class="wnLgNav__bottomInner">
            <div class="wnLgNav__row">
              <nav class="wnLgNav__col -info" aria-label="Site">
                <p class="wnLgNav__eyebrow -site">Site</p>
                <ul class="wnLgNav__list">
                  <li><a class="wnLgNav__item" href="/">Home</a></li>
                  <li><a class="wnLgNav__item" href="/company">About</a></li>
                  <li><a class="wnLgNav__item" href="/case-studies">Case Studies</a></li>
                  <li><a class="wnLgNav__item" href="/blog">Blog</a></li>
                  <li><a class="wnLgNav__item" href="/blog">Resources</a></li>
                  <li><a class="wnLgNav__item" href="/contact-us">Get in Touch</a></li>
                </ul>
              </nav>

              <div class="wnLgNav__col -services" data-wn-services-acc>
                <p class="wnLgNav__eyebrow -services">Services</p>
                <p class="wnLgNav__accHead" data-wn-acc-head>Services</p>

                <div class="wnLgNav__groups" data-wn-acc-body>
                  <details class="wnLgNav__group" open>
                    <summary class="wnLgNav__groupHead">
                      <span class="wnLgNav__groupLabel">Application Security</span>
                      <span class="wnLgNav__plus" aria-hidden="true"></span>
                    </summary>
                    <div class="wnLgNav__groupBody">
                      <p class="wnLgNav__groupDesc">Find and fix vulnerabilities in the software your customers rely on every day.</p>
                      <ul class="wnLgNav__groupList">
                        <li><a class="wnLgNav__link" href="/web-app-penetration-testing"><span class="wnLgNav__linkTitle">Web App Penetration Testing</span><span class="wnLgNav__linkDesc">Manual testing for complex web platforms and SaaS products.</span></a></li>
                        <li><a class="wnLgNav__link" href="/mobile-app-security-testing"><span class="wnLgNav__linkTitle">Mobile App Security Testing</span><span class="wnLgNav__linkDesc">iOS and Android apps tested against the OWASP MASVS.</span></a></li>
                        <li><a class="wnLgNav__link" href="/api-penetration-testing"><span class="wnLgNav__linkTitle">API Penetration Testing</span><span class="wnLgNav__linkDesc">REST, GraphQL and internal APIs probed for real attack paths.</span></a></li>
                        <li><a class="wnLgNav__link" href="/source-code-review"><span class="wnLgNav__linkTitle">Source Code Review</span><span class="wnLgNav__linkDesc">Static and manual review of the code behind your product.</span></a></li>
                      </ul>
                    </div>
                  </details>

                  <details class="wnLgNav__group">
                    <summary class="wnLgNav__groupHead">
                      <span class="wnLgNav__groupLabel">Infrastructure Security</span>
                      <span class="wnLgNav__plus" aria-hidden="true"></span>
                    </summary>
                    <div class="wnLgNav__groupBody">
                      <p class="wnLgNav__groupDesc">Test networks, cloud tenants and connected devices against real-world attack paths.</p>
                      <ul class="wnLgNav__groupList">
                        <li><a class="wnLgNav__link" href="/network-security-assessment"><span class="wnLgNav__linkTitle">Network Security Assessment</span><span class="wnLgNav__linkDesc">External and internal network testing end to end.</span></a></li>
                        <li><a class="wnLgNav__link" href="/cloud-security-testing"><span class="wnLgNav__linkTitle">Cloud Security Testing</span><span class="wnLgNav__linkDesc">AWS, Azure and GCP configuration and workload reviews.</span></a></li>
                        <li><a class="wnLgNav__link" href="/wireless-security-testing"><span class="wnLgNav__linkTitle">Wireless Security Testing</span><span class="wnLgNav__linkDesc">Office and site wireless networks attacked as an intruder would.</span></a></li>
                        <li><a class="wnLgNav__link" href="/iot-security-testing"><span class="wnLgNav__linkTitle">IoT Security Testing</span><span class="wnLgNav__linkDesc">Devices, firmware and companion apps tested as one system.</span></a></li>
                      </ul>
                    </div>
                  </details>

                  <details class="wnLgNav__group">
                    <summary class="wnLgNav__groupHead">
                      <span class="wnLgNav__groupLabel">Advanced Assessments</span>
                      <span class="wnLgNav__plus" aria-hidden="true"></span>
                    </summary>
                    <div class="wnLgNav__groupBody">
                      <p class="wnLgNav__groupDesc">Adversary simulation and compliance programs for teams that need proof, not promises.</p>
                      <ul class="wnLgNav__groupList">
                        <li><a class="wnLgNav__link" href="/red-team-assessment"><span class="wnLgNav__linkTitle">Red Team Assessment</span><span class="wnLgNav__linkDesc">Objective-based attacks that test detection and response.</span></a></li>
                        <li><a class="wnLgNav__link" href="/vapt-services"><span class="wnLgNav__linkTitle">VAPT Services</span><span class="wnLgNav__linkDesc">Continuous vulnerability assessment and penetration testing.</span></a></li>
                        <li><a class="wnLgNav__link" href="/compliance-security-audit"><span class="wnLgNav__linkTitle">Compliance Security Audit</span><span class="wnLgNav__linkDesc">SOC 2, ISO 27001 and PCI DSS readiness support.</span></a></li>
                        <li><a class="wnLgNav__link" href="/social-engineering-testing"><span class="wnLgNav__linkTitle">Social Engineering Testing</span><span class="wnLgNav__linkDesc">Phishing and human-layer testing done responsibly.</span></a></li>
                        <li><a class="wnLgNav__link" href="/managed-security-services"><span class="wnLgNav__linkTitle">Managed Security Services</span><span class="wnLgNav__linkDesc">Ongoing monitoring, detection and response.</span></a></li>
                      </ul>
                    </div>
                  </details>

                  <div class="wnLgNav__groupCta">
                    <p class="wnLgNav__groupCtaText">Let's talk about your next security priorities.</p>
                    <a class="wnLgBubbleBtn wnLgBubbleBtn--sm" href="/contact-us">
                      <span class="wnLgBubbleBtn__body">Get in touch</span>
                      <span class="wnLgBubbleBtn__arrow" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="wnLgNav__mobileCta">
              <a class="wnLgBubbleBtn wnLgBubbleBtn--block" href="/contact-us">
                <span class="wnLgBubbleBtn__body">Get in touch</span>
                <span class="wnLgBubbleBtn__arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
`;
