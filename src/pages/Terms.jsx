import LegalPage, { legalStyles as s } from '../components/LegalPage';
import { useSeo, pageMeta } from '../lib/seo';

export default function Terms() {
  useSeo(pageMeta({
    title: 'Terms of Service | Nicholas Liappas',
    description: 'Terms governing your use of nicholasliappas.com.',
    path: '/terms'
  }));

  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="September 23, 2026">
      <p style={s.p}>By using nicholasliappas.com (the "Site"), you agree to these terms. If you do not agree, please do not use the Site.</p>

      <h2 style={s.h2}>Who we are</h2>
      <p style={s.p}>The Site is operated by Nicholas Liappas, a Licensed Associate Real Estate Broker in the State of New York, affiliated with Compass. Compass is a licensed real estate broker and abides by Equal Housing Opportunity laws.</p>

      <h2 style={s.h2}>Informational purposes</h2>
      <p style={s.p}>Content on the Site, including community descriptions, market snapshots, average prices and any home valuation we provide, is for general informational purposes only. It is not a formal appraisal, legal, tax or financial advice, and it may not reflect current market conditions. Always verify information independently before making a real estate decision.</p>

      <h2 style={s.h2}>No agency relationship</h2>
      <p style={s.p}>Using the Site or submitting a form does not create an agency, brokerage or client relationship. Any such relationship is established only through a written agreement and the disclosures required by New York law.</p>

      <h2 style={s.h2}>Your submissions</h2>
      <p style={s.p}>You agree that the information you submit through the Site is accurate and that you are authorized to provide it. By submitting a form you consent to be contacted by phone, email or text about your inquiry. Our handling of your information is described in the <a href="/privacy" style={{ color: '#1a1a1a' }}>Privacy Policy</a>.</p>

      <h2 style={s.h2}>Intellectual property</h2>
      <p style={s.p}>Text, photographs and design on the Site belong to Nicholas Liappas or their respective owners and may not be reproduced without permission. Client testimonials are reproduced from public Google reviews.</p>

      <h2 style={s.h2}>Third-party sites</h2>
      <p style={s.p}>The Site links to third-party websites we do not control. We are not responsible for their content or practices.</p>

      <h2 style={s.h2}>Limitation of liability</h2>
      <p style={s.p}>The Site is provided "as is". To the fullest extent permitted by law, we are not liable for any loss arising from your use of, or reliance on, the Site or its content.</p>

      <h2 style={s.h2}>Governing law</h2>
      <p style={s.p}>These terms are governed by the laws of the State of New York.</p>

      <h2 style={s.h2}>Changes</h2>
      <p style={s.p}>We may update these terms at any time. Continued use of the Site after changes are posted means you accept the revised terms.</p>
    </LegalPage>
  );
}
