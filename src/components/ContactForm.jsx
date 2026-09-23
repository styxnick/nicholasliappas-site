import { useState } from 'react';
import { getStyles } from './styles';

export default function ContactForm({ trackEvent, formName = 'contact' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const styles = getStyles(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(false);

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': formName,
          ...formData
        }).toString()
      });
      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
      trackEvent('form_submit', 'Lead_Generation', formData.interest || 'General');
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 6000);
      setFormData({ name: '', email: '', phone: '', interest: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(true);
    }
  };

  return (
    <div style={{
      background: '#fafafa',
      padding: '56px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        border: '1px solid #e0e0e0',
        background: '#fff'
      }} />

      {formSubmitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#1a1a1a',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '24px'
          }}>✓</div>
          <h3 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '12px' }}>Thank You</h3>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            color: '#666'
          }}>I'll be in touch within 24 hours.</p>
        </div>
      ) : (
        <form
          name={formName}
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          aria-label="Request consultation form"
        >
          <input type="hidden" name="form-name" value={formName} />
          <input type="hidden" name="bot-field" />
          <h3 style={{
            fontSize: '24px',
            fontWeight: 400,
            marginBottom: '32px',
            letterSpacing: '1px'
          }}>Request a Consultation</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              style={styles.input}
            />
            <select
              name="interest"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
              required
              style={{ ...styles.input, color: formData.interest ? '#1a1a1a' : '#999' }}
            >
              <option value="">I'm interested in...</option>
              <option value="buying">Buying a Home</option>
              <option value="selling">Selling a Property</option>
              <option value="both">Buying & Selling</option>
              <option value="valuation">Home Valuation</option>
              <option value="investing">Investment Properties</option>
              <option value="relocation">Relocation Services</option>
            </select>

            <button type="submit" style={{ ...styles.btnPrimary, width: '100%', marginTop: '12px' }}>
              Get Started
            </button>

            {submitError && (
              <p role="alert" style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px',
                color: '#b00020',
                textAlign: 'center',
                lineHeight: 1.6
              }}>
                Something went wrong sending your request. Please call or text{' '}
                <a href="tel:+15162147761" style={{ color: '#b00020' }}>516-214-7761</a>{' '}
                or email <a href="mailto:nicholas.liappas@compass.com" style={{ color: '#b00020' }}>nicholas.liappas@compass.com</a>.
              </p>
            )}

            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px',
              color: '#999',
              textAlign: 'center',
              lineHeight: 1.6
            }}>
              By submitting, you agree to receive communications.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
