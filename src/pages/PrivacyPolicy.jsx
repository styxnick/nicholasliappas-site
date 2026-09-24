import LegalPage, { legalStyles as s } from '../components/LegalPage';
import { useSeo, pageMeta } from '../lib/seo';

export default function PrivacyPolicy() {
  useSeo(pageMeta({
    title: 'Privacy Policy | Nicholas Liappas',
    description: 'How nicholasliappas.com collects, uses and protects the information you share through its contact and home valuation forms.',
    path: '/privacy'
  }));

  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="September 23, 2026">
      <p style={s.p}>This website, nicholasliappas.com (the "Site"), is operated by Nicholas Liappas, a Licensed Associate Real Estate Broker with Compass ("we", "us"). This policy explains what information we collect through the Site and how we use it.</p>

      <h2 style={s.h2}>Information you give us</h2>
      <p style={s.p}>When you submit the contact form or the home valuation form, we collect the details you enter: your name, email address, phone number, what you're interested in, and, for a valuation request, the property address and ZIP code. Submissions are processed and stored by Netlify Forms, which hosts the Site, and forwarded to us by email.</p>

      <h2 style={s.h2}>How we use it</h2>
      <ul style={s.ul}>
        <li>To respond to your inquiry and provide the consultation or home valuation you requested.</li>
        <li>To follow up with you about your real estate goals.</li>
        <li>To comply with New York State real estate licensing and record-keeping requirements.</li>
      </ul>
      <p style={s.p}>We do not sell your personal information. We share it only with service providers that help us run the Site and respond to you (for example, our hosting and email providers), and with Compass as required to provide brokerage services.</p>

      <h2 style={s.h2}>Analytics and cookies</h2>
      <p style={s.p}>We use Google Analytics to understand how visitors use the Site. Google Analytics sets cookies and collects information such as pages visited, approximate location, device and browser type. We may also use the Meta Pixel to measure the effectiveness of our advertising. You can limit this tracking with your browser's cookie settings, the Google Analytics opt-out browser add-on, or your Meta ad preferences.</p>

      <h2 style={s.h2}>Retention</h2>
      <p style={s.p}>We keep form submissions for as long as needed to respond to you and to meet our legal obligations. You can ask us to delete your information at any time using the contact details below.</p>

      <h2 style={s.h2}>Third-party links</h2>
      <p style={s.p}>The Site links to third-party services such as Compass, Google, Instagram, LinkedIn and X. Their privacy practices are governed by their own policies.</p>

      <h2 style={s.h2}>Children</h2>
      <p style={s.p}>The Site is not directed to children under 13 and we do not knowingly collect information from them.</p>

      <h2 style={s.h2}>Changes</h2>
      <p style={s.p}>We may update this policy from time to time. The date at the top shows when it was last revised.</p>
    </LegalPage>
  );
}
