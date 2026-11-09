import { Link } from 'react-router-dom';
import { relocation as r } from '../data/relocation';
import { towns } from '../data/towns';
import { guides, guideForTown } from '../data/guides';
import { getStyles, FONT_SANS } from '../components/styles';
import ContactForm from '../components/ContactForm';
import { useSeo, pageMeta, SITE_URL } from '../lib/seo';

const INK = '#000';
const body = { fontFamily: FONT_SANS, fontSize: '16px', lineHeight: 1.5, color: INK, margin: '0 0 20px' };
const lead = { fontWeight: 600, color: INK };
const h2 = { fontSize: 'clamp(28px, 4vw, 34px)', fontWeight: 400, lineHeight: 1.2, margin: '0 0 22px', color: INK };
const label = { fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: INK, margin: '0 0 6px' };
const inlineLink = { fontFamily: FONT_SANS, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: INK, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #000', paddingBottom: '2px' };

function Bullets({ items }) {
  return (
    <ul style={{ ...body, listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
      {items.map(([l, t]) => (
        <li key={l} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
          <span aria-hidden="true" style={{ color: INK, fontSize: '8px', marginTop: '11px', flex: 'none' }}>◆</span>
          <span><span style={lead}>{l} </span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Relocation({ track }) {
  const styles = getStyles(false);
  const seo = pageMeta({ title: r.title, description: r.metaDescription, path: r.path });

  useSeo({
    ...seo,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Moving to Long Island', item: SITE_URL + r.path },
        ],
      },
    ],
  });

  return (
    <div style={styles.container}>
      <section style={{ ...styles.hero, height: 'auto', minHeight: '480px', padding: '180px 24px 90px', background: '#000', textAlign: 'center' }}>
        <div style={styles.heroContent}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px' }}>{r.eyebrow}</p>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.1, marginBottom: '20px' }}>{r.heading}</h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.subtitle}</p>
          <div style={{ marginTop: '40px' }}>
            <a href="#towns" onClick={() => track('cta_click', { cta: 'town_matcher', placement: 'hero' })} style={{ ...styles.btnPrimary, background: '#fff', color: '#000', display: 'inline-block' }}>Find your town</a>
          </div>
        </div>
      </section>

      <article style={{ padding: '80px 5% 20px', background: '#fff' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ ...body, fontSize: '19px', marginBottom: '48px' }}>{r.intro}</p>

          <h2 style={h2}>{r.whatChanges.heading}</h2>
          <Bullets items={r.whatChanges.items} />
        </div>
      </article>

      <section id="towns" style={{ padding: '60px 5% 40px', background: '#fff', scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ maxWidth: '680px' }}>
            <h2 style={h2}>{r.matcher.heading}</h2>
            <p style={{ ...body, marginBottom: '36px' }}>{r.matcher.intro}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {r.matcher.towns.map((m) => {
              const town = towns[m.slug];
              const guide = guideForTown(m.slug);
              return (
                <div key={m.slug} style={{ border: '1px solid #ccc', padding: '26px 24px', display: 'flex', flexDirection: 'column' }}>
                  <p style={label}>{m.from}</p>
                  <h3 style={{ fontSize: '26px', fontWeight: 400, margin: '0 0 14px', color: INK }}>{town.name}</h3>
                  <p style={{ ...body, fontSize: '15px', marginBottom: '14px' }}>{m.fit}</p>
                  <p style={{ ...body, fontSize: '14px', marginBottom: '18px' }}><span style={lead}>Commute. </span>{m.commute}</p>
                  <p style={{ ...body, fontSize: '14px', marginBottom: '22px' }}><span style={lead}>Homes. </span>{town.style}.</p>
                  <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '14px 24px' }}>
                    <Link to={`/${town.slug}`} onClick={() => track('cta_click', { cta: 'town_page', town: town.slug, placement: 'relocation' })} style={inlineLink}>{town.name} →</Link>
                    {guide && (
                      <Link to={`/${guide.slug}/buyers-guide`} onClick={() => track('cta_click', { cta: 'buyers_guide', town: town.slug, placement: 'relocation' })} style={inlineLink}>Buyer’s Guide →</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <article style={{ padding: '60px 5% 20px', background: '#fff' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={h2}>{r.differs.heading}</h2>
          <Bullets items={r.differs.items} />

          <hr style={{ border: 0, borderTop: '1px solid #ccc', margin: '40px 0' }} />

          <h2 style={h2}>{r.guidesHeading}</h2>
          <p style={body}>{r.guidesIntro}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
            {Object.values(guides).map((g) => (
              <li key={g.slug} style={{ padding: '16px 0', borderTop: '1px solid #ccc' }}>
                <Link to={`/${g.slug}/buyers-guide`} onClick={() => track('cta_click', { cta: 'buyers_guide', town: g.slug, placement: 'relocation_list' })} style={{ ...body, margin: 0, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span>{g.town} Buyer’s Guide</span><span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <section id="contact" style={{ padding: '80px 5% 120px', background: '#fff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ ...h2, marginBottom: '16px' }}>{r.cta.heading}</h2>
          <p style={{ ...body, marginBottom: '40px' }}>{r.cta.text}</p>
          <ContactForm track={track} defaultInterest="relocation" />
        </div>
      </section>
    </div>
  );
}
