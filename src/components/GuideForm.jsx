import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { getStyles, FONT_SANS } from './styles';
import { submitNetlifyForm, HoneypotField, HONEYPOT_FIELD } from '../lib/netlifyForms';

// Buyer's guide request form. Netlify form "buyers-guide" (mirror in
// index.html). submission-created emails the guide link to the requester and
// the lead to Nicholas (netlify/lib/lead-emails.js).
export default function GuideForm({ track, guide }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', [HONEYPOT_FIELD]: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const id = useId();
  const styles = getStyles(false);
  const guidePath = `/${guide.slug}/buyers-guide`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError(false);
    setSubmitting(true);
    try {
      await submitNetlifyForm('buyers-guide', { ...formData, town: guide.town, guide: guidePath });
      track('generate_lead', { form_name: 'buyers-guide', interest: 'buyers_guide', town: guide.slug });
      setSubmitted(true);
    } catch (err) {
      console.error('Guide form error:', err);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const small = { fontFamily: FONT_SANS, fontSize: '13px', color: '#000', lineHeight: 1.5 };

  if (submitted) {
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: '48px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>✓</div>
        <h3 style={{ fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>It’s on its way</h3>
        <p style={{ ...small, marginBottom: '24px' }}>Check your inbox for the {guide.town} Buyer’s Guide. You can also read it right now.</p>
        <Link to={guidePath} style={{ ...styles.btnPrimary }}>Read the guide</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', padding: '48px', position: 'relative' }}>
      <form name="buyers-guide" method="POST" onSubmit={handleSubmit} aria-label={`Request the ${guide.town} Buyer's Guide`}>
        <input type="hidden" name="form-name" value="buyers-guide" />
        <input type="hidden" name="town" value={guide.town} />
        <input type="hidden" name="guide" value={guidePath} />
        <HoneypotField value={formData[HONEYPOT_FIELD]} onChange={(e) => setFormData({ ...formData, [HONEYPOT_FIELD]: e.target.value })} />
        <p style={styles.sectionSubtitle}>Free guide</p>
        <h3 style={{ fontSize: '26px', fontWeight: 400, marginBottom: '8px', }}>The {guide.town} Buyer’s Guide</h3>
        <p style={{ ...small, marginBottom: '28px' }}>The villages and school zoning, housing stock, taxes, the commute, and how buying in New York actually works. Emailed to you instantly.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label htmlFor={`${id}-name`} style={styles.srOnly}>Full Name</label>
          <input id={`${id}-name`} type="text" name="name" placeholder="Full Name" autoComplete="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={styles.input} />
          <label htmlFor={`${id}-email`} style={styles.srOnly}>Email Address</label>
          <input id={`${id}-email`} type="email" name="email" placeholder="Email Address" autoComplete="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} />
          <label htmlFor={`${id}-phone`} style={styles.srOnly}>Phone Number (Optional)</label>
          <input id={`${id}-phone`} type="tel" name="phone" placeholder="Phone Number (Optional)" autoComplete="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={styles.input} />
          <button type="submit" disabled={submitting} style={{ ...styles.btnPrimary, width: '100%', marginTop: '8px', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Sending…' : 'Send me the guide'}
          </button>
          {error && (
            <p role="alert" style={{ ...small, color: '#b00020', textAlign: 'center' }}>
              Something went wrong. Please email <a href="mailto:nicholas.liappas@compass.com" style={{ color: '#b00020' }}>nicholas.liappas@compass.com</a> and I’ll send it over.
            </p>
          )}
          <p style={{ ...small, fontSize: '11px', color: '#000', textAlign: 'center' }}>By submitting, you agree to receive communications from Nicholas Liappas.</p>
        </div>
      </form>
    </div>
  );
}
