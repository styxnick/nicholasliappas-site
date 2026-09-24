import { Link } from 'react-router-dom';
import { getStyles } from './styles';

// Shared layout for Privacy Policy and Terms of Service.
export default function LegalPage({ eyebrow, title, updated, children }) {
  const styles = getStyles(false);
  const body = { fontFamily: "'Montserrat', sans-serif", fontSize: '14px', lineHeight: 2, color: '#444', marginBottom: '20px' };
  return (
    <div style={styles.container}>
      <section style={{
        ...styles.hero,
        height: 'auto',
        minHeight: '360px',
        padding: '160px 24px 80px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)',
        textAlign: 'center'
      }}>
        <div style={styles.heroContent}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '24px', opacity: 0.7 }}>{eyebrow}</p>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, letterSpacing: '3px', lineHeight: 1.1, marginBottom: '16px' }}>{title}</h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', letterSpacing: '1px', opacity: 0.7 }}>Last updated {updated}</p>
        </div>
      </section>
      <section style={{ padding: '80px 5% 120px', background: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {children}
          <p style={{ ...body, marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e8e8e8' }}>
            Questions? Email <a href="mailto:nicholas.liappas@compass.com" style={{ color: '#1a1a1a' }}>nicholas.liappas@compass.com</a> or call <a href="tel:516-214-7761" style={{ color: '#1a1a1a' }}>516-214-7761</a>. <Link to="/" style={{ color: '#1a1a1a' }}>Back to home</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

export const legalStyles = {
  h2: { fontSize: '26px', fontWeight: 400, letterSpacing: '1px', margin: '40px 0 16px' },
  p: { fontFamily: "'Montserrat', sans-serif", fontSize: '14px', lineHeight: 2, color: '#444', marginBottom: '20px' },
  ul: { fontFamily: "'Montserrat', sans-serif", fontSize: '14px', lineHeight: 2, color: '#444', margin: '0 0 20px 20px', padding: 0 },
};
