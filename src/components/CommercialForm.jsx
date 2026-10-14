import { useState, useId } from 'react';
import { getStyles } from './styles';
import { submitNetlifyForm, HoneypotField, HONEYPOT_FIELD } from '../lib/netlifyForms';
import { roles, formPropertyTypes, timelines } from '../data/commercial';

const empty = { name: '', email: '', phone: '', role: '', propertyType: '', location: '', size: '', timeline: '', message: '', [HONEYPOT_FIELD]: '' };

// Commercial inquiry form. Netlify form "commercial" (mirror in index.html).
// Attribution fields are appended by submitNetlifyForm.
export default function CommercialForm({ track }) {
  const [data, setData] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const id = useId();
  const styles = getStyles(false);
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError(false);
    setSubmitting(true);
    try {
      await submitNetlifyForm('commercial', data);
      track('generate_lead', { form_name: 'commercial', interest: data.role || 'general' });
      setSubmitted(true);
    } catch (err) {
      console.error('Commercial form error:', err);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyle = (v) => ({ ...styles.input, color: v ? '#1a1a1a' : '#707070' });
  const label = (htmlFor, text) => <label htmlFor={htmlFor} style={styles.srOnly}>{text}</label>;
  const small = { fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', lineHeight: 1.8 };

  return (
    <div style={{ background: '#fafafa', padding: 'clamp(32px, 5vw, 60px)', position: 'relative' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: '-20px', right: '-20px', width: '70px', height: '70px', background: '#fff' }} />
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>✓</div>
          <h3 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '12px' }}>Thank You</h3>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#666' }}>I'll be in touch within one business day.</p>
        </div>
      ) : (
        <form name="commercial" method="POST" data-netlify="true" data-netlify-honeypot={HONEYPOT_FIELD} onSubmit={handleSubmit} aria-label="Commercial inquiry form"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <input type="hidden" name="form-name" value="commercial" />
          <HoneypotField value={data[HONEYPOT_FIELD]} onChange={set(HONEYPOT_FIELD)} />

          {label(`${id}-name`, 'Full Name')}
          <input id={`${id}-name`} name="name" type="text" placeholder="Full Name *" required value={data.name} onChange={set('name')} style={styles.input} />
          {label(`${id}-email`, 'Email Address')}
          <input id={`${id}-email`} name="email" type="email" placeholder="Email Address *" required value={data.email} onChange={set('email')} style={styles.input} />
          {label(`${id}-phone`, 'Phone Number')}
          <input id={`${id}-phone`} name="phone" type="tel" placeholder="Phone Number *" required value={data.phone} onChange={set('phone')} style={styles.input} />

          {label(`${id}-role`, 'I am a')}
          <select id={`${id}-role`} name="role" required value={data.role} onChange={set('role')} style={selectStyle(data.role)}>
            <option value="">I am a… *</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {label(`${id}-type`, 'Property type')}
          <select id={`${id}-type`} name="propertyType" value={data.propertyType} onChange={set('propertyType')} style={selectStyle(data.propertyType)}>
            <option value="">Property type</option>
            {formPropertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          {label(`${id}-location`, 'Location or town')}
          <input id={`${id}-location`} name="location" type="text" placeholder="Location or town" value={data.location} onChange={set('location')} style={styles.input} />
          {label(`${id}-size`, 'Approximate size')}
          <input id={`${id}-size`} name="size" type="text" placeholder="Approximate size (sq ft or acres)" value={data.size} onChange={set('size')} style={styles.input} />

          {label(`${id}-timeline`, 'Timeline')}
          <select id={`${id}-timeline`} name="timeline" value={data.timeline} onChange={set('timeline')} style={selectStyle(data.timeline)}>
            <option value="">Timeline</option>
            {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          {label(`${id}-message`, 'Anything else I should know')}
          <textarea id={`${id}-message`} name="message" placeholder="Anything else I should know" rows={4} value={data.message} onChange={set('message')} style={{ ...styles.input, gridColumn: '1 / -1', resize: 'vertical', fontFamily: "'Montserrat', sans-serif" }} />

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={submitting} style={{ ...styles.btnPrimary, width: '100%', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Sending…' : 'Send'}
            </button>
            {error && <p role="alert" style={{ ...small, color: '#b00020', marginTop: '12px' }}>Something went wrong. Please call 516-214-7761 or try again.</p>}
            <p style={{ ...small, textAlign: 'center', marginTop: '14px' }}>By submitting, you agree to be contacted about your inquiry.</p>
          </div>
        </form>
      )}
    </div>
  );
}
