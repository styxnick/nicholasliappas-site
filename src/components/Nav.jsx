import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getStyles } from './styles';
import { towns } from '../data/towns';
import { useMediaQuery } from '../lib/useMediaQuery';

const MOBILE_BREAKPOINT = '(max-width: 1100px)';

const socialLinks = [
  {
    href: 'https://instagram.com/nicholasliappas',
    label: 'Follow Nicholas Liappas on Instagram',
    event: 'Instagram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    href: 'https://www.linkedin.com/in/nicholas-liappas-73482128/',
    label: 'Connect with Nicholas Liappas on LinkedIn',
    event: 'LinkedIn',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    href: 'https://x.com/nickliappas',
    label: 'Follow Nicholas Liappas on X',
    event: 'X_Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
];

export default function Nav({ trackEvent }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus whenever the route changes.
  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Leaving the mobile breakpoint closes the mobile menu.
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  // Mobile menu: lock body scroll, close on Escape, move focus in/out.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    menuRef.current?.querySelector('a, button')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Desktop dropdown: close on outside click.
  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [dropdownOpen]);

  const styles = getStyles(isScrolled);
  const townList = Object.values(towns);
  const textColor = isScrolled ? '#1a1a1a' : '#fff';

  const handleDropdownKeyDown = (e) => {
    if (e.key === 'Escape' && dropdownOpen) {
      e.stopPropagation();
      setDropdownOpen(false);
      dropdownRef.current?.querySelector('button')?.focus();
    }
  };

  const handleDropdownBlur = (e) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) setDropdownOpen(false);
  };

  const renderLogo = (dark) => (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', position: 'relative', zIndex: 1003 }} aria-label="The Liappas Team at Compass – home">
      <img
        src={dark ? '/logo-black.png' : '/logo-white.png'}
        alt="The Liappas Team"
        width={dark ? 58 : 40}
        height="40"
        style={{ height: '40px', width: 'auto', mixBlendMode: dark ? 'multiply' : 'screen' }}
      />
      <div aria-hidden="true" style={{
        height: '24px',
        width: '1px',
        background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
      }} />
      <img
        src={dark ? '/compass_black.png' : '/compass_white.png'}
        alt="Compass"
        width={dark ? 50 : 117}
        height="16"
        style={{ height: '16px', width: 'auto', mixBlendMode: dark ? 'multiply' : 'screen' }}
      />
    </Link>
  );

  const socialIcons = (color) => socialLinks.map((s) => (
    <a key={s.event} href={s.href} target="_blank" rel="noopener noreferrer"
       onClick={() => trackEvent('click', 'Social', s.event)}
       aria-label={s.label}
       style={{ color, textDecoration: 'none', display: 'inline-flex', padding: '6px', margin: '-6px' }}>
      {s.icon}
    </a>
  ));

  if (isMobile) {
    const menuId = 'mobile-menu';
    const barStyle = {
      display: 'block',
      width: '22px',
      height: '2px',
      background: menuOpen ? '#fff' : textColor,
      transition: 'all 0.3s ease'
    };
    const menuLink = {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: '3px',
      textTransform: 'uppercase',
      color: '#fff',
      textDecoration: 'none',
      display: 'block',
      padding: '14px 0'
    };
    const menuSubLink = {
      ...menuLink,
      fontSize: '13px',
      letterSpacing: '1px',
      textTransform: 'none',
      color: '#ccc',
      padding: '10px 0 10px 20px'
    };

    return (
      <nav aria-label="Main navigation" style={{ ...styles.nav, zIndex: 1002 }}>
        {renderLogo(isScrolled && !menuOpen)}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px',
            margin: '-12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            position: 'relative',
            zIndex: 1003
          }}
        >
          <span style={{ ...barStyle, transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ ...barStyle, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...barStyle, transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>

        {menuOpen && (
          <div
            id={menuId}
            ref={menuRef}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#1a1a1a',
              color: '#fff',
              zIndex: 1002,
              overflowY: 'auto',
              padding: '110px 8% 48px'
            }}
          >
            <Link to="/" style={menuLink}>Home</Link>
            <Link to="/#about" style={menuLink}>About</Link>
            <Link to="/#services" style={menuLink}>Services</Link>
            <div style={{ ...menuLink, color: '#888', fontSize: '11px', paddingBottom: '4px' }}>Communities</div>
            {townList.map((town) => (
              <Link key={town.slug} to={`/${town.slug}`} style={menuSubLink}>{town.name}</Link>
            ))}
            <Link to="/home-valuation" style={{ ...menuLink, marginTop: '8px' }}>Home Valuation</Link>
            <Link to="/#contact" style={menuLink}>Contact</Link>

            <div style={{ display: 'flex', gap: '32px', margin: '32px 0' }}>
              {socialIcons('#fff')}
            </div>

            <Link to="/#contact"
              onClick={() => trackEvent('click', 'CTA', 'Nav_Connect')}
              style={{ ...styles.btnOutline, display: 'block', textAlign: 'center' }}>
              LET'S CONNECT
            </Link>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="Main navigation" style={styles.nav}>
      {renderLogo(isScrolled)}

      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/#about" style={styles.navLink}>About</Link>
        <Link to="/#services" style={styles.navLink}>Services</Link>
        <div
          ref={dropdownRef}
          style={{ position: 'relative' }}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
          onKeyDown={handleDropdownKeyDown}
          onBlur={handleDropdownBlur}
        >
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-controls="communities-menu"
            style={{
              ...styles.navLink,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            Communities
          </button>
          {dropdownOpen && (
            <div id="communities-menu" style={{
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
              {townList.map((town) => (
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
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onFocus={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onBlur={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {town.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/#contact" style={styles.navLink}>Contact</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {socialIcons(textColor)}
        <Link to="/#contact" style={{
          ...styles.navLink,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '12px 28px',
          border: `1px solid ${textColor}`
        }} onClick={() => trackEvent('click', 'CTA', 'Nav_Connect')}>
          LET'S CONNECT
        </Link>
      </div>
    </nav>
  );
}
