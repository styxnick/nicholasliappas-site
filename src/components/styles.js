// Font tokens: the only place a font family is spelled out. The pairing follows
// Compass's "Designing for Agents" guide (v2) with open-licence stand-ins:
//   Compass Sans  -> Inter          (body, UI, caps details)
//   Compass Serif -> Newsreader     (display headings; Tiempos-like)
//   Pressura Mono -> IBM Plex Mono  (coordinates and technical details)
export const FONT_SANS = "'Inter', 'Helvetica Neue', Arial, sans-serif";
export const FONT_SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
export const FONT_MONO = "'IBM Plex Mono', Menlo, Consolas, monospace";

// Brand palette: black, white, and #CCCCCC as the only gray (hairlines, borders).
export const INK = '#000';
export const PAPER = '#fff';
export const RULE = '#ccc';
// Caps details may carry modest tracking; everything else sets at 0.
export const TRACK_CAPS = '0.08em';

export const getStyles = (isScrolled) => ({
  container: {
    fontFamily: FONT_SERIF,
    color: '#000',
    background: '#fff',
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
    background: isScrolled ? '#fff' : 'transparent',
    transition: 'all 0.4s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: isScrolled ? '1px solid #ccc' : 'none'
  },
  logo: {
    fontFamily: FONT_SANS,
    fontWeight: 500,
    fontSize: '12px',
    color: isScrolled ? '#000' : '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  navLinks: {
    display: 'flex',
    gap: '48px',
    fontFamily: FONT_SANS,
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  navLink: {
    color: isScrolled ? '#000' : '#fff',
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
    background: '#000'
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
    fontFamily: FONT_SANS,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#000',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 300,
    marginBottom: '20px',
    lineHeight: 1.2
  },
  btnPrimary: {
    background: '#000',
    color: '#fff',
    border: 'none',
    padding: '18px 48px',
    fontFamily: FONT_SANS,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnOutline: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    padding: '18px 48px',
    fontFamily: FONT_SANS,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    border: '1px solid #ccc',
    fontFamily: FONT_SANS,
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
