import PageLayout from './ui/PageLayout';
import Card from './ui/Card';

const Privacy = () => {
  return (
    <PageLayout containerClassName="max-w-4xl mx-auto py-12">
      <Card variant="elevated" padding="xl">
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <h1 className="text-3xl font-bold text-text-primary">Legal & Privacy</h1>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">Privacy Policy</h2>
            <div className="space-y-3">
              <p>Golden Pear Pediatrics is a mobile application developed by HealthBridge. This app is provided at no cost and is intended for use as-is.</p>
              <p>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information for anyone who chooses to use our Service.</p>
              <p>By choosing to use the Golden Pear Pediatrics app, you agree to the collection and use of information in accordance with this Privacy Policy. The Personal Information we collect is used to provide and improve our Service. We do not use or share your information with anyone except as described in this policy.</p>
              <p>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, unless otherwise defined here.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Information Collection and Use</h3>
            <div className="space-y-3">
              <p>To enhance your experience while using our Service, we may ask you to provide certain personally identifiable information, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Physical address</li>
              </ul>
              <p>This information is retained and used by HealthBridge as described in this Privacy Policy.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Log Data</h3>
            <div className="space-y-3">
              <p>If the app encounters an error, we collect data and information on your device called Log Data (through third-party services). This Log Data may include:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Your device's IP address</li>
                <li>Device name and OS version</li>
                <li>Time and date of app usage</li>
                <li>App configuration during use</li>
                <li>Other diagnostic statistics</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Cookies</h3>
            <div className="space-y-3">
              <p>Cookies are small files commonly used as anonymous unique identifiers. These may be sent to your browser and stored on your device. While the Golden Pear Pediatrics app does not use cookies directly, third-party services used by the app may utilize cookies to improve functionality.</p>
              <p>You can choose to accept or decline cookies. If you decline, certain portions of the Service may not function properly.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Service Providers</h3>
            <div className="space-y-3">
              <p>We may employ third-party companies and individuals for:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Facilitating our Service</li>
                <li>Providing the Service on our behalf</li>
                <li>Performing Service-related services</li>
                <li>Assisting in analyzing how our Service is used</li>
              </ul>
              <p>These third parties may have access to your Personal Information solely to perform these tasks and are obligated not to disclose or use the information for any other purpose.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Security</h3>
            <p>We value your trust in providing us with your Personal Information and strive to use commercially acceptable means of protecting it. However, no method of transmission over the internet or electronic storage is 100% secure. While we do our best, we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Links to Other Sites</h3>
            <p>Our Service may contain links to third-party websites. If you click a third-party link, you will be directed to that site. These external sites are not operated by us, and we strongly recommend you review their privacy policies. We assume no responsibility for their content or practices.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Children's Privacy</h3>
            <p>Golden Pear Pediatrics does not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal data, we will delete it immediately. If you are a parent or guardian and believe your child has shared personal information with us, please contact us.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-text-primary mb-3">Changes to This Privacy Policy</h3>
            <p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            <p>This policy is effective as of 22/04/2025</p>
          </section>

          <hr className="border-border-primary" />

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">Terms and Conditions</h2>
            <div className="space-y-3">
              <p>This website is operated by Health Bridge. Throughout the site, the terms "we", "us" and "our" refer to Health Bridge. Golden Pear Pediatrics offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here. By accessing our site and/or using our services, you engage in our "Service" and agree to comply with the following Terms and Conditions ("Terms of Use", "Terms"), including any additional guidelines or policies referenced or linked herein. These Terms apply to all visitors of the site, including but not limited to browsers, vendors, customers, merchants, and content contributors. Please read these Terms carefully before using our website. By accessing any portion of the site, you consent to these Terms. If you disagree with any part, you must not use our services. If this document is considered an offer, acceptance is expressly limited to these terms. Any new features or tools introduced shall also be governed by these Terms. You can always access the latest version of these Terms on this page. We reserve the right to update or modify these Terms at any time by posting changes here. It is your responsibility to review these terms periodically. Continued use of the website after changes constitutes your acceptance of those changes.</p>
            </div>
          </section>

          <hr className="border-border-primary" />

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">Our Commitment to Preventing Child Sexual Abuse and Exploitation (CSAE)</h2>
            <div className="space-y-3">
              <p>At Healthbridge, we take the safety and well-being of children extremely seriously. We have zero tolerance for any form of child sexual abuse or exploitation. Our platform is designed to provide professional pediatric care through secure and responsible digital communication. We are committed to the following principles:</p>

              <div>
                <p className="font-semibold text-text-primary">1. Strict Content Monitoring and Controls</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>All photo and video uploads are intended solely for medical consultation.</li>
                  <li>Our system prohibits and actively monitors for any inappropriate or non-medical content.</li>
                  <li>Users who upload or attempt to upload any content that violates our policies are subject to immediate account termination and may be reported to relevant authorities.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-text-primary">2. Mandatory User Authentication</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Every user must verify their identity before using our platform.</li>
                  <li>Pediatricians and healthcare professionals are verified and licensed medical providers.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-text-primary">3. Data Security &amp; Privacy</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>All data, including images and videos, are encrypted and securely stored.</li>
                  <li>Only authorized medical professionals can view uploaded content.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-text-primary">4. Reporting &amp; Enforcement</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>We provide clear and accessible channels for users and staff to report any suspected abuse or policy violations.</li>
                  <li>We cooperate with law enforcement agencies to investigate and report any activity related to CSAE.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-text-primary">5. Compliance with Google Play's CSAE Policies</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Our app complies with Google Play's policies on child safety and CSAE prevention.</li>
                  <li>We routinely audit our platform to ensure ongoing compliance and safety.</li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-border-primary" />

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <p className="text-primary-600 dark:text-primary-400 font-medium">healthbridge.main@gmail.com</p>
          </section>
        </div>
      </Card>
    </PageLayout>
  );
};

export default Privacy;