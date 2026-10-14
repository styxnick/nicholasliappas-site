import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStyles, FONT_SANS } from '../components/styles';
import CommercialForm from '../components/CommercialForm';
import { useSeo, pageMeta, SITE_URL } from '../lib/seo';
import { useMediaQuery } from '../lib/useMediaQuery';
import { propertyTypes, whoIRepresent, walkthroughChecks, howItWorks, markets, greekLine, faqs, seo, complianceLine } from '../data/commercial';
import { commercialTransactions } from '../data/commercialTransactions';
import { commercialListings } from '../data/commercialListings';

const PHONE = '516-214-7761';
const FALLBACK = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)';

// <picture> with webp + jpg sources that degrades to a dark gradient when the
// file is missing or fails to load. `src` is the path without extension.
function Photo({ src, alt, style, eager = false }) {
  const [failed, setFailed] = useState(!src);
  const box = { position: 'relative', overflow: 'hidden', background: FALLBACK, ...style };
  if (failed) return <div aria-hidden="true" style={box} />;
  return (
    <div style={box}>
      <picture>
        <source srcSet={`${src}.webp`} type="image/webp" />
        <img src={`${src}.jpg`} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
             onError={() => setFailed(true)}
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </picture>
    </div>
  );
}

const Eyebrow = ({ children, light }) => (
  <p style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.7)' : '#707070', marginBottom: '16px' }}>{children}</p>
);

const Body = ({ children, style }) => (
  <p style={{ fontFamily: FONT_SANS, fontSize: '15px', lineHeight: 2, color: '#666', ...style }}>{children}</p>
);

const Tag = ({ children, dark }) => (
  <span style={{ fontFamily: FONT_SANS, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 10px', border: `1px solid ${dark ? '#1a1a1a' : '#ddd'}`, color: '#1a1a1a', background: '#fff' }}>{children}</span>
);

export default function Commercial({ track }) {
  const styles = getStyles(false);
  const small = useMediaQuery('(max-width: 640px)');
  const [tab, setTab] = useState('sales');
  const [showAll, setShowAll] = useState(false);

  const path = '/commercial';
  const url = `${SITE_URL}${path}`;
  const base = pageMeta({ title: seo.title, description: seo.description, path });
  useSeo({
    ...base,
    meta: [
      ...base.meta,
      { property: 'og:image', content: `${SITE_URL}/commercial/hero.jpg` },
      { name: 'twitter:image', content: `${SITE_URL}/commercial/hero.jpg` },
      { name: 'keywords', content: 'commercial real estate, retail leasing, office space, medical office, land for sale, Manhasset, Port Washington, Queens, North Fork, Nicholas Liappas, Compass' },
    ],
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': `${SITE_URL}/#agent`,
        name: 'Nicholas Liappas',
        url,
        image: `${SITE_URL}/nicholas-headshot.jpg`,
        telephone: '+1-516-214-7761',
        email: 'nicholas.liappas@compass.com',
        address: { '@type': 'PostalAddress', streetAddress: '1468 Northern Blvd', addressLocality: 'Manhasset', addressRegion: 'NY', postalCode: '11030', addressCountry: 'US' },
        parentOrganization: { '@type': 'Organization', name: 'Compass', url: 'https://www.compass.com' },
        areaServed: ['North Shore, Long Island, NY', 'Queens, NY', 'North Fork, Long Island, NY'],
        makesOffer: propertyTypes.map((p) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${p.title} — ${p.tags.join(' & ')}`,
            serviceType: 'Commercial real estate brokerage',
            provider: { '@id': `${SITE_URL}/#agent` },
            areaServed: ['North Shore, Long Island, NY', 'Queens, NY', 'North Fork, Long Island, NY'],
          },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Commercial', item: url },
        ],
      },
    ],
  });

  const phoneBtn = (placement, outline = true) => (
    <a href={`tel:${PHONE}`} onClick={() => track('phone_click', { placement })} style={outline ? styles.btnOutline : styles.btnPrimary}>Call {PHONE}</a>
  );
  const h2 = { ...styles.sectionTitle };
  const section = (bg) => ({ padding: 'clamp(72px, 10vw, 120px) 5%', background: bg });
  const inner = (max = 1200) => ({ maxWidth: `${max}px`, margin: '0 auto' });
  const visibleTransactions = showAll ? commercialTransactions : commercialTransactions.slice(0, 6);

  return (
    <div style={styles.container}>
      {/* Hero */}
      <section style={{ ...styles.hero, minHeight: '640px', height: 'auto', padding: '200px 0 120px' }}>
        <Photo src="/commercial/hero" alt="" eager style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.45)', zIndex: 1 }} />
        <div style={{ ...styles.heroContent, maxWidth: '900px' }}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: small ? '2px' : '4px', textTransform: 'uppercase', marginBottom: '24px', opacity: 0.75 }}>
            Commercial Real Estate · The Liappas Team at Compass
          </p>
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 300, letterSpacing: '3px', lineHeight: 1.05, marginBottom: '28px' }}>
            Commercial Property, Seen Clearly.
          </h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 400, lineHeight: 2, maxWidth: '680px', margin: '0 auto 44px', opacity: 0.9, textShadow: '0 1px 14px rgba(0,0,0,0.7)' }}>
            Sales and leasing for land, retail, office, medical, mixed-use and industrial property across the North Shore, Queens and the North Fork. I represent owners, buyers, landlords and tenants, and I can see what a building really needs because I've built them.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/commercial#inquiry" onClick={() => track('cta_click', { cta: 'schedule', placement: 'hero' })} style={styles.btnPrimary}>Discuss a Property</Link>
            {phoneBtn('hero')}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section style={section('#fff')}>
        <div style={{ ...inner(1100), display: 'grid', gridTemplateColumns: small ? '1fr' : '1fr 1.4fr', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'start' }}>
          <div>
            <Eyebrow>Built Different</Eyebrow>
            <h2 style={h2}>A Broker Who Reads the Building</h2>
          </div>
          <div>
            <Body>Commercial deals are won or lost on details that never show up in a listing. These include the age of the rooftop units, whether the electrical service can carry a new tenant, what the certificate of occupancy actually permits, and what a build-out will really cost.</Body>
            <Body style={{ marginTop: '20px' }}>My background in construction means I walk a property the way a contractor does. I also price it the way an investor does and negotiate it the way a broker should. With the reach of Compass and a team ranked among the top in the country, your property gets in front of the right buyers and tenants and isn't left waiting on a listing site.</Body>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section style={section('#fafafa')} aria-label="Property types">
        <div style={inner()}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Eyebrow>Property Types</Eyebrow>
            <h2 style={h2}>What I Sell and Lease</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
            {propertyTypes.map((p) => (
              <article key={p.title} style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <Photo src={p.image ? `/commercial/transactions/${p.image}` : ''} alt="" style={{ aspectRatio: '3 / 2', width: '100%' }} />
                <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 400, letterSpacing: '1px', lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', lineHeight: 1.9, color: '#666', flex: 1 }}>{p.text}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Transactions */}
      {commercialTransactions.length > 0 && (
        <section style={section('#fff')} aria-label="Selected commercial transactions">
          <div style={inner()}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <Eyebrow>Track Record</Eyebrow>
              <h2 style={h2}>Selected Commercial Transactions</h2>
              <Body style={{ maxWidth: '640px', margin: '0 auto' }}>Sales and leases across Long Island, Queens and the Bronx, representing sellers, buyers, landlords and tenants.</Body>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {visibleTransactions.map((t) => (
                <article key={t.slug || t.address} style={{ background: '#fafafa' }}>
                  <Photo src={t.slug ? `/commercial/transactions/${t.slug}` : ''} alt={t.address} style={{ aspectRatio: '3 / 2', width: '100%' }} />
                  <div style={{ padding: '24px 24px 28px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '0.5px', marginBottom: '4px' }}>{t.address}</h3>
                    {t.town && <p style={{ fontFamily: FONT_SANS, fontSize: '12px', letterSpacing: '1px', color: '#707070', marginBottom: '14px' }}>{t.town}</p>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      {t.type && <Tag>{t.type}</Tag>}
                      {(t.dealType || t.role) && (
                        <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#444' }}>{[t.dealType, t.role].filter(Boolean).join(' · ')}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {commercialTransactions.length > 6 && !showAll && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button type="button" onClick={() => setShowAll(true)} style={{ ...styles.btnOutline, color: '#1a1a1a', borderColor: '#1a1a1a' }}>View All</button>
              </div>
            )}
            <p style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '32px', fontStyle: 'italic' }}>Transactions by The Liappas Team at Compass.</p>
          </div>
        </section>
      )}

      {/* Who I Represent */}
      <section style={section('#fafafa')} aria-label="Who I represent">
        <div style={inner()}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <Eyebrow>Representation</Eyebrow>
            <h2 style={h2}>Who I Represent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {whoIRepresent.map((w) => (
              <div key={w.title} style={{ background: '#fff', padding: '32px', borderTop: '1px solid #1a1a1a' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '1px', marginBottom: '10px' }}>{w.title}</h3>
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', lineHeight: 1.9, color: '#666' }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Walkthrough */}
      <section style={{ ...section('#1a1a1a'), color: '#fff' }} aria-label="The construction edge">
        <div style={inner(1100)}>
          <Eyebrow light>The Construction Edge</Eyebrow>
          <h2 style={{ ...h2, color: '#fff' }}>What I Look For That Others Miss</h2>
          <p style={{ fontFamily: FONT_SANS, fontSize: '15px', lineHeight: 2, color: 'rgba(255,255,255,0.8)', maxWidth: '720px', marginBottom: '48px' }}>
            Before you buy, lease or price a property, I walk it with a builder's eye. Here's what I'm checking:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: small ? '1fr' : '1fr 1fr', gap: '14px 48px' }}>
            {walkthroughChecks.map((c) => (
              <li key={c} style={{ fontFamily: FONT_SANS, fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ fontSize: '8px', marginTop: '9px', flexShrink: 0 }}>◆</span>{c}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '24px', fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.5px', marginTop: '56px', color: '#fff' }}>
            Knowing these before the LOI is signed is leverage. Finding them after is a cost.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section style={section('#fff')} aria-label="How it works">
        <div style={inner(1000)}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Eyebrow>Process</Eyebrow>
            <h2 style={h2}>How It Works</h2>
          </div>
          <div role="tablist" aria-label="Sales or leasing" style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '48px', flexWrap: 'wrap' }}>
            {Object.entries(howItWorks).map(([key, v]) => (
              <button key={key} role="tab" type="button" aria-selected={tab === key} id={`tab-${key}`} aria-controls={`panel-${key}`} onClick={() => setTab(key)}
                      style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 28px', cursor: 'pointer', border: '1px solid #1a1a1a', background: tab === key ? '#1a1a1a' : '#fff', color: tab === key ? '#fff' : '#1a1a1a' }}>
                {key === 'sales' ? 'Sales' : 'Leasing'}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            <h3 style={{ fontSize: '26px', fontWeight: 400, letterSpacing: '1px', textAlign: 'center', marginBottom: '40px' }}>{howItWorks[tab].label}</h3>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '20px' }}>
              {howItWorks[tab].steps.map(([name, text], i) => (
                <li key={name} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', alignItems: 'start', padding: '24px 0', borderTop: '1px solid #e8e8e8' }}>
                  <span style={{ fontSize: '32px', fontWeight: 300, color: '#bbb', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, letterSpacing: '1px', marginBottom: '6px' }}>{name}</h4>
                    <p style={{ fontFamily: FONT_SANS, fontSize: '14px', lineHeight: 1.9, color: '#666' }}>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section style={section('#fafafa')} aria-label="Markets">
        <div style={inner(1100)}>
          <Eyebrow>Markets</Eyebrow>
          <h2 style={h2}>Where I Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {markets.map((m) => (
              <div key={m.name} style={{ background: '#fff', padding: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 400, letterSpacing: '1px', marginBottom: '12px' }}>{m.name}</h3>
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', lineHeight: 1.9, color: '#666' }}>{m.text}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: FONT_SANS, fontSize: '13px', lineHeight: 1.9, color: '#666', fontStyle: 'italic', marginTop: '32px' }}>{greekLine}</p>
        </div>
      </section>

      {/* Available Now (hidden until listings exist) */}
      {commercialListings.length > 0 && (
        <section style={section('#fff')} aria-label="Available now">
          <div style={inner()}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <Eyebrow>Listings</Eyebrow>
              <h2 style={h2}>Available Now</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {commercialListings.map((l) => (
                <article key={l.compassUrl || l.title} style={{ background: '#fafafa' }}>
                  <Photo src={l.image ? l.image.replace(/\.(jpg|webp)$/, '') : ''} alt={l.title} style={{ aspectRatio: '3 / 2', width: '100%' }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}><Tag>{l.type}</Tag><Tag dark>{l.dealType}</Tag></div>
                    <h3 style={{ fontSize: '22px', fontWeight: 400, marginBottom: '4px' }}>{l.title}</h3>
                    <p style={{ fontFamily: FONT_SANS, fontSize: '12px', letterSpacing: '1px', color: '#707070', marginBottom: '12px' }}>{[l.town, l.size, l.price].filter(Boolean).join(' · ')}</p>
                    {l.compassUrl && <a href={l.compassUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_click', { cta: 'view_listing', placement: 'commercial_listings' })} style={{ fontFamily: FONT_SANS, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1a1a1a', textDecoration: 'none', fontWeight: 500 }}>View Details →</a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry form */}
      <section id="inquiry" style={{ ...section('#fff'), scrollMarginTop: '72px' }} aria-label="Commercial inquiry">
        <div style={{ ...inner(), display: 'grid', gridTemplateColumns: small ? '1fr' : '1fr 1.3fr', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'start' }}>
          <div>
            <Eyebrow>Start a Conversation</Eyebrow>
            <h2 style={h2}>Tell Me About the Property or the Space You Need</h2>
            <Body style={{ marginBottom: '40px' }}>I'll get back to you within one business day.</Body>
            <div style={{ paddingTop: '32px', borderTop: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href={`tel:${PHONE}`} onClick={() => track('phone_click', { placement: 'contact' })} style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1a1a1a', textDecoration: 'none', letterSpacing: '1px' }}>M: {PHONE}</a>
              <a href="mailto:nicholas.liappas@compass.com" onClick={() => track('email_click', { placement: 'contact' })} style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1a1a1a', textDecoration: 'none' }}>nicholas.liappas@compass.com</a>
            </div>
          </div>
          <CommercialForm track={track} />
        </div>
      </section>

      {/* FAQ */}
      <section style={section('#fafafa')} aria-label="Frequently asked questions">
        <div style={inner(860)}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Eyebrow>Questions</Eyebrow>
            <h2 style={h2}>Commercial Real Estate FAQ</h2>
          </div>
          {faqs.map((f) => (
            <details key={f.q} style={{ background: '#fff', padding: '4px 28px', marginBottom: '12px' }}>
              <summary style={{ fontSize: '21px', fontWeight: 400, letterSpacing: '0.5px', padding: '20px 0', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                {f.q}<span aria-hidden="true" style={{ fontFamily: FONT_SANS, color: '#888' }}>+</span>
              </summary>
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', lineHeight: 1.9, color: '#666', padding: '0 0 24px' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ ...section('#1a1a1a'), color: '#fff', textAlign: 'center' }}>
        <div style={inner(800)}>
          <h2 style={{ ...h2, color: '#fff' }}>Have a Property or a Space in Mind?</h2>
          <p style={{ fontFamily: FONT_SANS, fontSize: '15px', lineHeight: 2, color: 'rgba(255,255,255,0.8)', marginBottom: '44px' }}>A ten-minute call is usually enough to know whether it makes sense.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/commercial#inquiry" onClick={() => track('cta_click', { cta: 'schedule', placement: 'bottom_cta' })} style={{ ...styles.btnPrimary, background: '#fff', color: '#1a1a1a' }}>Schedule a Call</Link>
            {phoneBtn('bottom_cta')}
          </div>
          <p style={{ fontFamily: FONT_SANS, fontSize: '11px', lineHeight: 1.9, color: 'rgba(255,255,255,0.5)', marginTop: '64px', letterSpacing: '0.5px' }}>{complianceLine}</p>
        </div>
      </section>
    </div>
  );
}
