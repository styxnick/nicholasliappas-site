import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStyles } from '../components/styles';
import ContactForm from '../components/ContactForm';
import { useSeo, SITE_URL } from '../lib/seo';
import { GOOGLE_REVIEWS_URL } from '../data/site';

export default function Home({ trackEvent }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const styles = getStyles(false);

  // Verbatim excerpts from Google reviews (5.0, all five-star). Full names as shown on Google.
  const testimonials = [
    {
      name: "Marc DeSimone",
      text: "From our very first meeting, Nick took the time to understand exactly what we were looking for and went above and beyond to make sure we found the perfect home. The negotiation process can be daunting, but Nick handled it with finesse, ensuring we got the best possible deal.",
      location: "Home Purchase"
    },
    {
      name: "Kevin Caballes",
      text: "We were moving from Brooklyn back to Long Island and he really helped us navigate the buying process when searching for the right home for us including recommending different lawyers, inspectors, etc who were all also great to work with. He also was able to guide us in getting my mother's home ready for sale and had multiple offers ready for us after the first open house.",
      location: "Bought & Sold, Long Island"
    },
    {
      name: "Matthew Weitzman",
      text: "I had 3 cash offers within the first four days. He yielded me a closing deal $7k above asking price, and the highest selling 1 bedroom Coop price in Roslyn Gardens history. I couldn't have been happier!",
      location: "Sold, Roslyn"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeTestimonial, testimonials.length]);

  const schemas = [
      { "@context": "https://schema.org", "@type": "WebSite", "name": "Nicholas Liappas – The Liappas Team at Compass", "url": "https://nicholasliappas.com", "inLanguage": "en-US" },
      { "@context": "https://schema.org", "@type": "Person", "@id": "https://nicholasliappas.com/#person", "name": "Nicholas Liappas", "givenName": "Nicholas", "familyName": "Liappas", "jobTitle": "Licensed Associate Real Estate Broker", "url": "https://nicholasliappas.com", "image": "https://nicholasliappas.com/nicholas-headshot.jpg", "telephone": "+1-516-214-7761", "email": "nicholas.liappas@compass.com", "alumniOf": { "@type": "CollegeOrUniversity", "name": "Stony Brook University" }, "knowsLanguage": [{"@type":"Language","name":"English"},{"@type":"Language","name":"Greek"}], "worksFor": { "@type": "Organization", "name": "Compass", "url": "https://www.compass.com" }, "address": { "@type": "PostalAddress", "addressLocality": "Manhasset", "addressRegion": "NY", "postalCode": "11030", "addressCountry": "US" }, "sameAs": ["https://instagram.com/nicholasliappas","https://www.linkedin.com/in/nicholas-liappas-73482128/","https://x.com/nickliappas","https://www.facebook.com/nickliappas/","https://www.compass.com/agents/nicholas-liappas/"] },
      { "@context": "https://schema.org", "@type": ["RealEstateAgent","LocalBusiness"], "@id": "https://nicholasliappas.com/#business", "name": "Nicholas Liappas – The Liappas Team at Compass", "alternateName": ["The Liappas Team","Nicholas Liappas Compass"], "url": "https://nicholasliappas.com", "logo": "https://nicholasliappas.com/logo-black.png", "image": "https://nicholasliappas.com/nicholas-headshot.jpg", "telephone": "+1-516-214-7761", "email": "nicholas.liappas@compass.com", "priceRange": "$$$", "address": { "@type": "PostalAddress", "streetAddress": "1468 Northern Blvd", "addressLocality": "Manhasset", "addressRegion": "NY", "postalCode": "11030", "addressCountry": "US" }, "geo": { "@type": "GeoCoordinates", "latitude": "40.7979", "longitude": "-73.7004" }, "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "08:00", "closes": "20:00" }, "areaServed": [{"@type":"City","name":"Manhasset"},{"@type":"City","name":"Port Washington"},{"@type":"City","name":"Roslyn"},{"@type":"City","name":"East Hills"},{"@type":"City","name":"Glen Head"},{"@type":"City","name":"Glenwood Landing"},{"@type":"City","name":"Great Neck"},{"@type":"City","name":"Bayside"},{"@type":"City","name":"Greenport"},{"@type":"City","name":"Cutchogue"},{"@type":"AdministrativeArea","name":"Nassau County, NY"},{"@type":"AdministrativeArea","name":"Suffolk County, NY"},{"@type":"AdministrativeArea","name":"Queens, NY"},{"@type":"AdministrativeArea","name":"North Shore, Long Island"},{"@type":"AdministrativeArea","name":"North Fork, Long Island"}], "sameAs": ["https://instagram.com/nicholasliappas","https://www.linkedin.com/in/nicholas-liappas-73482128/","https://x.com/nickliappas","https://www.facebook.com/nickliappas/","https://www.compass.com/agents/nicholas-liappas/","https://maps.google.com/?cid=8697876814809743847"] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type":"Question","name":"What areas does Nicholas Liappas serve?","acceptedAnswer":{"@type":"Answer","text":"Nicholas Liappas serves Long Island's North Shore (Manhasset, Port Washington, Roslyn, East Hills, Glen Head, Glenwood Landing, Great Neck, Oyster Bay), Queens (Bayside, Flushing), and the North Fork (Greenport, Cutchogue, Southold)."}},{"@type":"Question","name":"What makes Nicholas Liappas different?","acceptedAnswer":{"@type":"Answer","text":"Nicholas brings 15+ years of real estate experience combined with a hands-on construction background, delivering record-breaking results including the highest-selling 1-bedroom co-op price in Roslyn Gardens history."}},{"@type":"Question","name":"How can I contact Nicholas Liappas?","acceptedAnswer":{"@type":"Answer","text":"Call 516-214-7761, email nicholas.liappas@compass.com, or submit a consultation request at nicholasliappas.com. Available 7 days a week, 8AM–8PM."}}] },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type":"ListItem","position":1,"name":"Home","item":"https://nicholasliappas.com"},{"@type":"ListItem","position":2,"name":"About","item":"https://nicholasliappas.com/#about"},{"@type":"ListItem","position":3,"name":"Services","item":"https://nicholasliappas.com/#services"},{"@type":"ListItem","position":4,"name":"Contact","item":"https://nicholasliappas.com/#contact"}] }
  ];

  useSeo({
    title: 'Nicholas Liappas | Real Estate Broker | North Shore, Queens & North Fork NY',
    meta: [
      { name: 'description', content: 'Nicholas Liappas – Licensed Associate Real Estate Broker at Compass. Serving Manhasset, Port Washington, Roslyn, East Hills, Glen Head, Glenwood Landing, Great Neck, Bayside & North Fork. Record-breaking sales, construction expertise, 15+ years experience. Call 516-214-7761.' },
      { name: 'keywords', content: 'Nicholas Liappas, Nicholas Liappas realtor, Nicholas Liappas Compass, Liappas Team, real estate agent Manhasset NY, real estate agent Port Washington NY, real estate agent Roslyn NY, real estate agent East Hills NY, real estate agent Glen Head NY, real estate agent Glenwood Landing NY, real estate agent Great Neck NY, real estate agent Bayside Queens, real estate agent North Fork NY, real estate broker North Shore Long Island, luxury homes North Shore Long Island, homes for sale Manhasset, homes for sale Port Washington, homes for sale Roslyn, homes for sale East Hills, homes for sale Glen Head, homes for sale Glenwood Landing, homes for sale Great Neck, Compass real estate Long Island, buy home Long Island, sell home Long Island, commercial real estate Long Island, developer sales Long Island, Nassau County realtor, Suffolk County realtor, North Fork luxury homes' },
      { name: 'author', content: 'Nicholas Liappas' },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
      { name: 'geo.region', content: 'US-NY' },
      { name: 'geo.placename', content: 'Manhasset, New York' },
      { name: 'geo.position', content: '40.7979;-73.7004' },
      { name: 'ICBM', content: '40.7979, -73.7004' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'language', content: 'English' },
      { name: 'category', content: 'Real Estate' },
      { name: 'coverage', content: 'Long Island, Queens, North Fork, New York' },
      { property: 'og:title', content: 'Nicholas Liappas | Real Estate Broker | North Shore, Queens & North Fork NY' },
      { property: 'og:description', content: 'Licensed Associate Real Estate Broker at Compass. Record-breaking results for buyers & sellers across Manhasset, Port Washington, Roslyn, East Hills, Glen Head, Glenwood Landing, Great Neck, Bayside & North Fork. Built Different, Sold Better.' },
      { property: 'og:url', content: `${SITE_URL}/` },
      { name: 'twitter:title', content: 'Nicholas Liappas | Real Estate Broker | North Shore, Queens & North Fork NY' },
      { name: 'twitter:description', content: 'Licensed Associate Real Estate Broker at Compass. Record-breaking results for buyers & sellers across Long Island & Queens. Built Different, Sold Better.' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/` }],
    schemas,
  });

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section aria-label="Introduction" style={styles.hero}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a1a 100%)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          zIndex: 1
        }} />

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
            The Liappas Team at Compass
          </p>

          <h1 style={{
            fontSize: 'clamp(48px, 10vw, 100px)',
            fontWeight: 300,
            letterSpacing: '4px',
            lineHeight: 1,
            marginBottom: '24px'
          }}>
            Nicholas Liappas
          </h1>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 500,
            letterSpacing: '8px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            Built Different, Sold Better.
          </p>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px',
            fontWeight: 300,
            letterSpacing: '1px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: 2,
            opacity: 0.7
          }}>
            Licensed Associate Real Estate Broker specializing in residential, commercial, and development sales across the North Shore, Queens & North Fork markets.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" onClick={() => trackEvent('click', 'CTA', 'Schedule_Hero')} style={styles.btnPrimary}>
              Schedule Consultation
            </Link>
            <a href="https://www.compass.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click', 'CTA', 'Search_Hero')} style={styles.btnOutline}>
              Your Search Begins Here
            </a>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px',
            letterSpacing: '3px',
            color: '#fff',
            opacity: 0.5
          }}>SCROLL</span>
          <div style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)'
          }} />
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="contact" aria-label="Contact form" style={{ padding: '120px 5%', background: '#fff', scrollMarginTop: '72px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div>
            <p style={styles.sectionSubtitle}>Let's Connect</p>
            <h2 style={styles.sectionTitle}>Your Real Estate<br />Journey Starts Here</h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '40px',
              maxWidth: '480px'
            }}>
              Whether you're buying your dream home, selling for top dollar, or exploring investment opportunities across the North Shore, Queens, or North Fork—I bring a consultative approach with construction expertise that protects your investment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {[
                'Construction expertise that identifies critical issues',
                'Deep local knowledge as a North Shore native',
                'Record-breaking results for sellers',
                'Commercial sales & developer relationships',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#1a1a1a', fontSize: '8px' }}>◆</span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '13px',
                    letterSpacing: '0.5px'
                  }}>{item}</span>
                </div>
              ))}
            </div>

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
              <a href="https://instagram.com/nicholasliappas" target="_blank" rel="noopener noreferrer"
                 onClick={() => trackEvent('click', 'Social', 'Instagram_Contact')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '14px',
                   color: '#1a1a1a',
                   textDecoration: 'none',
                   marginTop: '8px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                </svg>
                @nicholasliappas
              </a>
              <a href="https://www.linkedin.com/in/nicholas-liappas-73482128/" target="_blank" rel="noopener noreferrer"
                 onClick={() => trackEvent('click', 'Social', 'LinkedIn_Contact')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '14px',
                   color: '#1a1a1a',
                   textDecoration: 'none',
                   marginTop: '4px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a href="https://x.com/nickliappas" target="_blank" rel="noopener noreferrer"
                 onClick={() => trackEvent('click', 'Social', 'X_Twitter_Contact')}
                 style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '14px',
                   color: '#1a1a1a',
                   textDecoration: 'none',
                   marginTop: '4px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @nickliappas
              </a>
            </div>
          </div>

          <ContactForm trackEvent={trackEvent} formName="contact" />
        </div>
      </section>

      {/* About Nicholas Section */}
      <section id="about" aria-label="About Nicholas Liappas" style={{ padding: '120px 5%', background: '#f8f8f8', scrollMarginTop: '72px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '3/4',
              background: 'linear-gradient(135deg, #c0c0c0 0%, #888 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <picture>
                <source srcSet="/nicholas-headshot.webp" type="image/webp" />
                <img
                  src="/nicholas-headshot.jpg"
                  alt="Nicholas Liappas - Licensed Associate Real Estate Broker at Compass"
                  width="1800"
                  height="1201"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top'
                  }}
                />
              </picture>
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-24px',
              right: '-24px',
              background: '#1a1a1a',
              color: '#fff',
              padding: '32px'
            }}>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                opacity: 0.7,
                display: 'block',
                marginBottom: '8px'
              }}>Co-Principal</span>
              <span style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '1px' }}>The Liappas Team</span>
            </div>
          </div>

          <div>
            <p style={styles.sectionSubtitle}>Meet Nicholas</p>
            <h2 style={styles.sectionTitle}>Your Trusted North Shore Real Estate Team</h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '24px'
            }}>
              As a native of the North Shore and co-principal of The Liappas Team at Compass, I bring a unique combination of deep local knowledge and hands-on construction expertise to every transaction.
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '24px'
            }}>
              My background in construction allows me to identify critical issues that may impact your real estate investment, while helping you visualize a home's true potential through cost-effective modifications and strategic upgrades.
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '24px'
            }}>
              Beyond residential sales, I specialize in commercial real estate transactions, connecting property owners with developers seeking prime locations for new construction and mixed-use projects throughout Long Island and Queens.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '32px',
              borderTop: '1px solid #e0e0e0'
            }}>
              {['Buyer\'s Agent', 'Listing Agent', 'Commercial', 'Relocation', 'Consulting'].map((spec, i) => (
                <span key={i} style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '10px 20px',
                  background: '#fff',
                  border: '1px solid #e0e0e0'
                }}>{spec}</span>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#707070', marginBottom: '8px' }}>
                Languages: English & Greek
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#707070' }}>
                Education: Stony Brook University, B.A. Philosophy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About The Team Section */}
      <section aria-label="About The Liappas Team" style={{ padding: '120px 5%', background: '#fff' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div style={{ order: 2 }}>
            <p style={styles.sectionSubtitle}>The Liappas Team</p>
            <h2 style={styles.sectionTitle}>Full-Service Real Estate Solutions</h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '24px'
            }}>
              The Liappas Team is a premier real estate group at Compass, combining decades of collective experience with an unwavering commitment to client success. Our team approach ensures you always have a knowledgeable professional available to assist you.
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '24px'
            }}>
              From first-time homebuyers to seasoned investors, from residential sales to commercial development deals, our diverse expertise covers every aspect of real estate across Long Island's North Shore, Queens, and the North Fork.
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              lineHeight: 2,
              color: '#666',
              marginBottom: '24px'
            }}>
              When you work with The Liappas Team, you get the personalized attention of a boutique firm backed by the global reach and cutting-edge technology of Compass.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              paddingTop: '32px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <div>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '36px',
                  fontWeight: 300,
                  display: 'block',
                  marginBottom: '4px'
                }}>$100M+</span>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#707070'
                }}>In Sales Volume</span>
              </div>
              <div>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '36px',
                  fontWeight: 300,
                  display: 'block',
                  marginBottom: '4px'
                }}>200+</span>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#707070'
                }}>Transactions Closed</span>
              </div>
              <div>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '36px',
                  fontWeight: 300,
                  display: 'block',
                  marginBottom: '4px'
                }}>15+</span>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#707070'
                }}>Years Experience</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', order: 1 }}>
            <div style={{
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #c0c0c0 0%, #888 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <picture>
                <source srcSet="/team-photo.webp" type="image/webp" />
                <img
                  src="/team-photo.jpg"
                  alt="The Liappas Team at Compass - Real Estate Agents serving North Shore, Queens and North Fork"
                  width="1400"
                  height="934"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </picture>
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-24px',
              left: '-24px',
              background: '#1a1a1a',
              color: '#fff',
              padding: '32px'
            }}>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                opacity: 0.7,
                display: 'block',
                marginBottom: '12px'
              }}>Powered By</span>
              <img
                src="/compass_white.png"
                alt="Compass"
                width="102"
                height="14"
                loading="lazy"
                style={{ height: '14px', width: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" aria-label="Real estate services" style={{ padding: '120px 5%', background: '#fff', scrollMarginTop: '72px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <p style={styles.sectionSubtitle}>Full-Service Real Estate</p>
            <h2 style={styles.sectionTitle}>Full-Service Real Estate Solutions</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'Buyer Representation',
                description: 'With deep understanding of design, construction, and renovation, I help you visualize potential and identify issues before they become problems.',
                icon: '⌂'
              },
              {
                title: 'Seller Services',
                description: 'Strategic marketing, expert pricing, and skilled negotiation that delivers results. Record-breaking sales and multiple offers are the standard.',
                icon: '◈'
              },
              {
                title: 'Commercial & Development',
                description: 'Specialized expertise in commercial real estate sales to developers. From land assemblage to mixed-use properties, I connect sellers with qualified developers for maximum returns.',
                icon: '◆'
              },
              {
                title: 'Relocation & Consulting',
                description: 'Whether you\'re moving to Long Island or exploring investment opportunities, I provide comprehensive market analysis and timely guidance.',
                icon: '◇'
              },
            ].map((service, i) => (
              <div key={i} style={{
                padding: '40px',
                background: '#fafafa',
                transition: 'all 0.4s ease'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '24px' }}>{service.icon}</span>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 400,
                  marginBottom: '16px',
                  letterSpacing: '1px'
                }}>{service.title}</h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px',
                  lineHeight: 1.9,
                  color: '#666'
                }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '120px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={styles.sectionSubtitle}>Client Testimonials</p>
          <h2 style={{ ...styles.sectionTitle, marginBottom: '60px' }}>What Clients Say</h2>

          <div style={{ position: 'relative', minHeight: '220px' }}>
            {testimonials.map((testimonial, i) => (
              <div key={i} style={{
                position: i === activeTestimonial ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: i === activeTestimonial ? 1 : 0,
                transition: 'all 0.6s ease',
                pointerEvents: i === activeTestimonial ? 'auto' : 'none'
              }}>
                <div aria-hidden="true" style={{ fontSize: '48px', color: '#e0e0e0', marginBottom: '24px' }}>"</div>
                <p style={{
                  fontSize: 'clamp(16px, 2vw, 22px)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  marginBottom: '32px',
                  color: '#333',
                  maxWidth: '750px',
                  margin: '0 auto 32px'
                }}>
                  {testimonial.text}
                </p>
                <div style={{ marginTop: '32px' }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '4px'
                  }}>{testimonial.name}</span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '11px',
                    color: '#707070',
                    letterSpacing: '1px'
                  }}>{testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '48px' }}>
            {testimonials.map((_, i) => (
              <button key={i} type="button" onClick={() => setActiveTestimonial(i)}
                aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                aria-pressed={i === activeTestimonial}
                style={{
                width: i === activeTestimonial ? '40px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: i === activeTestimonial ? '#1a1a1a' : '#ddd',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>

          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"
             onClick={() => trackEvent('click', 'Social', 'Google_Reviews')}
             style={{
               display: 'inline-block',
               marginTop: '40px',
               fontFamily: "'Montserrat', sans-serif",
               fontSize: '12px',
               letterSpacing: '2px',
               textTransform: 'uppercase',
               color: '#1a1a1a',
               textDecoration: 'none',
               borderBottom: '1px solid #1a1a1a',
               paddingBottom: '4px'
             }}>
            Read all reviews on Google →
          </a>
        </div>
      </section>

      {/* Instagram CTA */}
      <section style={{ padding: '80px 5%', background: '#f8f8f8', textAlign: 'center' }}>
        <a href="https://instagram.com/nicholasliappas" target="_blank" rel="noopener noreferrer"
           onClick={() => trackEvent('click', 'Social', 'Instagram_CTA')}
           style={{ textDecoration: 'none', color: '#1a1a1a' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '24px' }}>
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="18" cy="6" r="1.5" fill="currentColor" />
          </svg>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            color: '#707070'
          }}>Follow Along</p>
          <h3 style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '1px' }}>@nicholasliappas</h3>
        </a>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 5%',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 300,
            marginBottom: '24px',
            letterSpacing: '2px',
            lineHeight: 1.3
          }}>
            Ready to Make Your Move?
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '40px',
            lineHeight: 1.8
          }}>
            Let's discuss your real estate goals and create a personalized strategy.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" onClick={() => trackEvent('click', 'CTA', 'Schedule_Bottom')} style={{ ...styles.btnPrimary, background: '#fff', color: '#1a1a1a' }}>
              Schedule Consultation
            </Link>
            <a href="tel:516-214-7761"
               onClick={() => trackEvent('click', 'Contact', 'Phone_CTA')}
               style={{
                 ...styles.btnOutline,
                 border: '1px solid rgba(255,255,255,0.3)'
               }}>
              Call 516-214-7761
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
