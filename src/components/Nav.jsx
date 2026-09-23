import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStyles } from './styles';
import { towns } from '../data/towns';

export default function Nav({ trackEvent }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCommunitiesDropdown, setShowCommunitiesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = getStyles(isScrolled);

  return (
    <nav role="navigation" aria-label="Main navigation" style={styles.nav}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
        <img
          src={isScrolled ? '/logo-black.png' : '/logo-white.png'}
          alt="The Liappas Team"
          style={{ height: '40px', width: 'auto', mixBlendMode: isScrolled ? 'multiply' : 'screen' }}
        />
        <div style={{
          height: '24px',
          width: '1px',
          background: isScrolled ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
        }} />
        <img
          src={isScrolled ? '/compass_black.png' : '/compass_white.png'}
          alt="Compass"
          style={{ height: '16px', width: 'auto', mixBlendMode: isScrolled ? 'multiply' : 'screen' }}
        />
      </Link>

      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>
          Home
        </Link>
        <a href="/#about" style={styles.navLink}>
          About
        </a>
        <a href="/#services" style={styles.navLink}>
          Services
        </a>
        <a href="/#blog" style={styles.navLink}>
          Blog
        </a>
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowCommunitiesDropdown(true)}
          onMouseLeave={() => setShowCommunitiesDropdown(false)}
        >
          <button
            style={{
              ...styles.navLink,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            Communities
          </button>
          {showCommunitiesDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: isScrolled ? '#fff' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '4px',
              minWidth: '220px',
              zIndex: 1001,
              padding: '12px 0',
              marginTop: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              {Object.values(towns).map((town) => (
                <Link
                  key={town.slug}
                  to={`/${town.slug}`}
                  style={{
                    display: 'block',
                    padding: '12px 24px',
                    color: '#1a1a1a',
                    textDecoration: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '1px',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  onClick={() => setShowCommunitiesDropdown(false)}
                >
                  {town.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <a href="/#contact" style={styles.navLink}>
          Contact
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a href="https://instagram.com/nicholasliappas" target="_blank" rel="noopener noreferrer"
           onClick={() => trackEvent('click', 'Social', 'Instagram')}
           aria-label="Follow Nicholas Liappas on Instagram"
           style={{ color: isScrolled ? '#1a1a1a' : '#fff', textDecoration: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="18" cy="6" r="1.5" fill="currentColor" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/nicholas-liappas-73482128/" target="_blank" rel="noopener noreferrer"
           onClick={() => trackEvent('click', 'Social', 'LinkedIn')}
           aria-label="Connect with Nicholas Liappas on LinkedIn"
           style={{ color: isScrolled ? '#1a1a1a' : '#fff', textDecoration: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a href="https://x.com/nickliappas" target="_blank" rel="noopener noreferrer"
           onClick={() => trackEvent('click', 'Social', 'X_Twitter')}
           aria-label="Follow Nicholas Liappas on X"
           style={{ color: isScrolled ? '#1a1a1a' : '#fff', textDecoration: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href="/#contact" style={{
          ...styles.navLink,
          padding: '12px 28px',
          border: `1px solid ${isScrolled ? '#1a1a1a' : '#fff'}`
        }} onClick={() => trackEvent('click', 'CTA', 'Nav_Connect')}>
          LET'S CONNECT
        </a>
      </div>
    </nav>
  );
}
