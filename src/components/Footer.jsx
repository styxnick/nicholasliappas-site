import { Link } from 'react-router-dom';
import { towns } from '../data/towns';

export default function Footer({ trackEvent }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#1a1a1a', color: '#fff', padding: '80px 5% 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '60px',
          marginBottom: '60px',
          paddingBottom: '60px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* About */}
          <div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>About</h4>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              lineHeight: 2,
              color: '#ccc',
              marginBottom: '16px'
            }}>
              Licensed Associate Real Estate Broker specializing in residential, commercial, and development sales across the North Shore, Queens & North Fork.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <a href="https://instagram.com/nicholasliappas" target="_blank" rel="noopener noreferrer"
                 onClick={() => trackEvent('click', 'Social', 'Instagram_Footer')}
                 style={{ color: '#fff', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" fill="#1a1a1a" />
                  <circle cx="18" cy="6" r="1.5" fill="#1a1a1a" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/nicholas-liappas-73482128/" target="_blank" rel="noopener noreferrer"
                 onClick={() => trackEvent('click', 'Social', 'LinkedIn_Footer')}
                 style={{ color: '#fff', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://x.com/nickliappas" target="_blank" rel="noopener noreferrer"
                 onClick={() => trackEvent('click', 'Social', 'X_Twitter_Footer')}
                 style={{ color: '#fff', textDecoration: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Communities */}
          <div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>Communities</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Object.values(towns).map((town) => (
                <li key={town.slug} style={{ marginBottom: '12px' }}>
                  <Link to={`/${town.slug}`}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px',
                      color: '#ccc',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                    onMouseLeave={(e) => e.target.style.color = '#ccc'}
                  >
                    {town.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Home Buying', 'Home Selling', 'Home Valuation', 'Commercial', 'Investment Properties', 'Relocation'].map((service) => (
                <li key={service} style={{ marginBottom: '12px' }}>
                  <Link to="/#services"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px',
                      color: '#ccc',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                    onMouseLeave={(e) => e.target.style.color = '#ccc'}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="tel:516-214-7761"
                 onClick={() => trackEvent('click', 'Contact', 'Phone_Footer')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '13px',
                   color: '#ccc',
                   textDecoration: 'none'
                 }}>
                516-214-7761
              </a>
              <a href="mailto:nicholas.liappas@compass.com"
                 onClick={() => trackEvent('click', 'Contact', 'Email_Footer')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '13px',
                   color: '#ccc',
                   textDecoration: 'none'
                 }}>
                nicholas.liappas@compass.com
              </a>
              <Link to="/home-valuation"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px',
                  color: '#ccc',
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = '#ccc'}
              >
                Free Home Valuation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px',
          color: '#888',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p>&copy; {currentYear} Nicholas Liappas. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="https://www.compass.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#888', textDecoration: 'none' }}>
              Compass
            </a>
            <a href="/#" style={{ color: '#888', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <a href="/#" style={{ color: '#888', textDecoration: 'none' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
