export const getStyles = (isScrolled) => ({
  container: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#1a1a1a',
    background: '#fefefe',
    minHeight: '100vh',
    overflowX: 'hidden'
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: isScrolled ? '16px 5%' : '28px 5%',
    background: isScrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
    transition: 'all 0.4s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none'
  },
  logo: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    fontSize: '12px',
    letterSpacing: '4px',
    color: isScrolled ? '#1a1a1a' : '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  navLinks: {
    display: 'flex',
    gap: '48px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  navLink: {
    color: isScrolled ? '#1a1a1a' : '#fff',
    textDecoration: 'none',
    transition: 'opacity 0.3s',
    cursor: 'pointer'
  },
  hero: {
    height: '100vh',
    minHeight: '700px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)'
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: '#fff',
    padding: '0 24px',
    maxWidth: '1000px'
  },
  sectionSubtitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: '#707070',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 300,
    letterSpacing: '2px',
    marginBottom: '20px',
    lineHeight: 1.2
  },
  btnPrimary: {
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    padding: '18px 48px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnOutline: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.5)',
    padding: '18px 48px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    border: '1px solid #e0e0e0',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '14px',
    transition: 'all 0.3s ease',
    background: '#fff'
  },
  // Visually hidden but available to screen readers (form labels).
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  }
});
