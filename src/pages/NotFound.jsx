import { Link } from 'react-router-dom';
import { getStyles } from '../components/styles';
import { towns } from '../data/towns';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  const styles = getStyles(false);

  useSeo({
    title: 'Page Not Found | Nicholas Liappas',
    meta: [{ name: 'robots', content: 'noindex' }]
  });

  return (
    <div style={styles.container}>
      <section style={{
        ...styles.hero,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)',
        textAlign: 'center'
      }}>
        <div style={styles.heroContent}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            opacity: 0.7
          }}>
            404
          </p>
          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 72px)',
            fontWeight: 300,
            letterSpacing: '4px',
            lineHeight: 1.1,
            marginBottom: '24px'
          }}>
            Page Not Found
          </h1>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            fontWeight: 300,
            letterSpacing: '1px',
            maxWidth: '520px',
            margin: '0 auto 40px',
            lineHeight: 2,
            opacity: 0.8
          }}>
            The page you're looking for doesn't exist or has moved. Explore one of the communities below or head back to the homepage.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {Object.values(towns).map((town) => (
              <Link key={town.slug} to={`/${town.slug}`} style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 18px',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                {town.name}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ ...styles.btnPrimary, background: '#fff', color: '#1a1a1a' }}>
              Back to Home
            </Link>
            <Link to="/#contact" style={styles.btnOutline}>
              Contact Nicholas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
