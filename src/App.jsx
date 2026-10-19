import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import SiteFonts from './components/SiteFonts.jsx';
import SiteLoader from './components/SiteLoader.jsx';
import AnimatedBlueLines from './components/AnimatedBlueLines/AnimatedBlueLines.jsx';


import { createPage } from './pages/createPage.jsx';

const IndexPage = createPage('index');
const BlogPage = createPage('blog');
const BlogPentestPage = createPage('blog-how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch');
const CaseStudiesPage = createPage('case-studies');
const CompanyPage = createPage('company');
const ContactUsPage = createPage('contact-us');
const MicrosoftAssessmentsPage = createPage('microsoft-assessments');
const WebAppPentrationTesting = createPage('web-app-penetration-testing');
const MobileAppSecurityTesting = createPage('mobile-app-security-testing');
const ApiPenetrationTesting = createPage('api-penetration-testing');
const SourceCodeReview = createPage('source-code-review');
const NetworkSecurityAssessment = createPage('network-security-assessment');
const CloudSecurityTesting = createPage('cloud-security-testing');
const WirelessSecurityTesting = createPage('wireless-security-testing');
const IotSecurityTesting = createPage('iot-security-testing');
const RedTeamAssessment = createPage('red-team-assessment');
const VaptServices = createPage('vapt-services');
const ComplianceSecurityAudit = createPage('compliance-security-audit');
const SocialEngineeringTesting = createPage('social-engineering-testing');
const ManagedSecurityServices = createPage('managed-security-services');

function HomePage() {
  return <IndexPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteFonts />
      <SiteLoader />

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-M8WLHDG"
          height="0"
          width="0"
          style={{
            display: 'none',
            visibility: 'hidden',
          }}
          title="Google Tag Manager"
        />
      </noscript>

      <div className="wnStage">

        {/* Global animated background */}
        {/* <AnimatedBlueLines /> */}

        {/* Website content */}
        <div className="wnContent">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route
              path="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch"
              element={<BlogPentestPage />}
            />
            <Route
              path="/blog/foci-foreign-influence-cyber-risk"
              element={<Navigate to="/blog/how-a-web-application-pentest-uncovered-critical-vulnerabilities-before-a-major-product-launch" replace />}
            />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />

            <Route
              path="/microsoft-assessments"
              element={<MicrosoftAssessmentsPage />}
            />

            <Route
              path="/web-app-penetration-testing"
              element={<WebAppPentrationTesting />}
            />

            <Route
              path="/mobile-app-security-testing"
              element={<MobileAppSecurityTesting />}
            />

            <Route
              path="/api-penetration-testing"
              element={<ApiPenetrationTesting />}
            />

            <Route
              path="/source-code-review"
              element={<SourceCodeReview />}
            />

            <Route
              path="/network-security-assessment"
              element={<NetworkSecurityAssessment />}
            />

            <Route
              path="/cloud-security-testing"
              element={<CloudSecurityTesting />}
            />

            <Route
              path="/wireless-security-testing"
              element={<WirelessSecurityTesting />}
            />

            <Route
              path="/iot-security-testing"
              element={<IotSecurityTesting />}
            />

            <Route
              path="/red-team-assessment"
              element={<RedTeamAssessment />}
            />

            <Route
              path="/vapt-services"
              element={<VaptServices />}
            />

            <Route
              path="/compliance-security-audit"
              element={<ComplianceSecurityAudit />}
            />

            <Route
              path="/social-engineering-testing"
              element={<SocialEngineeringTesting />}
            />

            <Route
              path="/managed-security-services"
              element={<ManagedSecurityServices />}
            />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}