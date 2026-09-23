import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { towns } from '../data/towns';
import { getStyles } from '../components/styles';
import ContactForm from '../components/ContactForm';

export default function TownPage({ trackEvent }) {
  const { slug } = useParams();
  const town = towns[slug];
  const styles = getStyles(false);

  useEffect(() => {
    if (!town) return;

    document.title = town.title;
    const metaTags = [
      { name: 'description', content: town.metaDescription },
      { name: 'keywords', content: `${town.name} real estate, homes for sale ${town.name}, ${town.name} real estate agent, Nicholas Liappas, Compass` },
    ];
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    const canonicalUrl = `https://nicholasliappas.com/${town.slug}`;
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);

    const schema = {
      "@context": "https://schema.org",
      "@type": ["RealEstateAgent", "LocalBusiness"],
      "name": `Nicholas Liappas – Real Estate in ${town.name}`,
      "url": canonicalUrl,
      "telephone": "+1-516-214-7761",
      "email": "nicholas.liappas@compass.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1050 Northern Blvd",
        "addressLocality": town.name,
        "addressRegion": "NY",
        "postalCode": town.zipCode,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": town.lat,
        "longitude": town.lng
      },
      "areaServed": {
        "@type": "City",
        "name": town.name
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(schema);
    document.head.appendChild(schemaScript);

    return () => {
      document.querySelectorAll('meta[name="description"], meta[name="keywords"], link[rel="canonical"], script[type="application/ld+json"]').forEach((el, i) => {
        if (i > 0) el.remove();
      });
    };
  }, [town]);

  if (!town) {
    return (
      <div style={styles.container}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Town not found</h1>
        </div>
      </div>
    );
  }

  const otherTowns = Object.values(towns).filter(t => t.slug !== slug);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={{
        ...styles.hero,
        paddingTop: '200px',
        minHeight: '600px',
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
            opacity: 0.7,
            color: '#fff'
          }}>
            North Shore Real Estate
          </p>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 80px)',
            fontWeight: 300,
            letterSpacing: '4px',
            lineHeight: 1,
            marginBottom: '24px',
            color: '#fff'
          }}>
            {town.h1}
          </h1>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            opacity: 0.9,
            color: '#fff'
          }}>
            {town.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" onClick={() => trackEvent('click', 'CTA', `Schedule_${town.slug}`)} style={styles.btnPrimary}>
              Schedule Consultation
            </a>
            <a href="tel:516-214-7761"
               onClick={() => trackEvent('click', 'Contact', `Phone_${town.slug}`)}
               style={styles.btnOutline}>
              Call 516-214-7761
            </a>
          </div>
        </div>
      </section>

      {/* Town Description */}
      <section style={{ padding: '120px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>{town.name} Real Estate</h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '16px',
            lineHeight: 2,
            color: '#666',
            marginBottom: '40px'
          }}>
            {town.description}
          </p>

          <div style={{ marginBottom: '60px' }}>
            <h3 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '18px',
              fontWeight: 500,
              marginBottom: '24px',
              letterSpacing: '1px'
            }}>
              Why {town.name}?
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {town.highlights.map((highlight, i) => (
                <li key={i} style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  lineHeight: 2,
                  color: '#666',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ color: '#1a1a1a', fontSize: '8px' }}>◆</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Market Snapshot */}
      <section style={{ padding: '120px 5%', background: '#f8f8f8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            ...styles.sectionTitle,
            textAlign: 'center',
            marginBottom: '60px'
          }}>Market Snapshot</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            <div style={{
              background: '#fff',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '4px'
            }}>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: '12px'
              }}>Average Price</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 300,
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>
                {town.avgPrice}
              </p>
            </div>

            <div style={{
              background: '#fff',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '4px'
            }}>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: '12px'
              }}>Zip Code</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 300,
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>
                {town.zipCode}
              </p>
            </div>

            <div style={{
              background: '#fff',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '4px'
            }}>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: '12px'
              }}>Property Style</p>
              <p style={{
                fontSize: '14px',
                fontWeight: 300,
                color: '#1a1a1a',
                marginBottom: '8px',
                lineHeight: 1.5
              }}>
                {town.style}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" style={{ padding: '120px 5%', background: '#fff' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div>
            <p style={styles.sectionSubtitle}>Ready to Explore?</p>
            <h2 style={styles.sectionTitle}>Find Your {town.name} Home</h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '40px'
            }}>
              Whether you're searching for your dream home, ready to sell, or exploring investment opportunities in {town.name}, I'm here to guide you through every step. Schedule a consultation to discuss your real estate goals.
            </p>

            <div style={{
              paddingTop: '32px',
              borderTop: '1px solid #e8e8e8',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <a href="tel:516-214-7761"
                 onClick={() => trackEvent('click', 'Contact', 'Phone_Mobile')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '14px',
                   color: '#1a1a1a',
                   textDecoration: 'none',
                   letterSpacing: '1px'
                 }}>
                M: 516-214-7761
              </a>
              <a href="mailto:nicholas.liappas@compass.com"
                 onClick={() => trackEvent('click', 'Contact', 'Email')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '14px',
                   color: '#1a1a1a',
                   textDecoration: 'none'
                 }}>
                nicholas.liappas@compass.com
              </a>
            </div>
          </div>

          <ContactForm trackEvent={trackEvent} formName="contact" />
        </div>
      </section>

      {/* Browse Other Communities */}
      <section style={{ padding: '120px 5%', background: '#f8f8f8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            ...styles.sectionTitle,
            textAlign: 'center',
            marginBottom: '60px'
          }}>Explore Other North Shore Communities</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {otherTowns.map((t) => (
              <Link
                key={t.slug}
                to={`/${t.slug}`}
                style={{
                  padding: '40px',
                  background: '#fff',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  marginBottom: '12px',
                  color: '#1a1a1a',
                  letterSpacing: '1px'
                }}>
                  {t.name}
                </h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px',
                  color: '#888',
                  marginBottom: '16px',
                  lineHeight: 1.6
                }}>
                  {t.description.substring(0, 120)}...
                </p>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#1a1a1a',
                  fontWeight: 500
                }}>
                  Explore {t.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
