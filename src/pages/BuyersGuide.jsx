import { useParams, Link } from 'react-router-dom';
import { guides } from '../data/guides';
import { towns } from '../data/towns';
import { getStyles, FONT_SANS } from '../components/styles';
import ContactForm from '../components/ContactForm';
import Photo from '../components/Photo';
import NotFound from './NotFound';
import { useSeo, pageMeta, SITE_URL } from '../lib/seo';

const INK = '#000';
const body = { fontFamily: FONT_SANS, fontSize: '16px', lineHeight: 1.5, color: '#000', margin: '0 0 20px' };
const lead = { fontWeight: 600, color: INK };
const h2 = { fontSize: 'clamp(28px, 4vw, 34px)', fontWeight: 400, lineHeight: 1.2, margin: '0 0 22px', color: INK };
const h3 = { fontSize: '22px', fontWeight: 400, margin: '40px 0 14px', color: INK };
const rule = { border: 0, borderTop: '1px solid #ccc', margin: '0' };
const cardLabel = { fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#000', margin: '0 0 4px' };

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p style={body}>{block.lead && <span style={lead}>{block.lead} </span>}{block.text}</p>;
    case 'h3':
      return <h3 style={h3}>{block.text}</h3>;
    case 'bullets':
      return (
        <ul style={{ ...body, listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
              <span aria-hidden="true" style={{ color: INK, fontSize: '8px', marginTop: '11px', flex: 'none' }}>◆</span>
              <span>
                {it.lead && <span style={lead}>{it.lead} </span>}{it.text}
                {it.sub && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 4px' }}>
                    {it.sub.map((t, j) => (
                      <li key={j} style={{ display: 'flex', gap: '12px', marginBottom: '6px', fontSize: '15px', color: '#000' }}>
                        <span aria-hidden="true" style={{ color: '#000', marginTop: '1px', flex: 'none' }}>–</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol style={{ ...body, listStyle: 'none', padding: 0, margin: '0 0 24px', counterReset: 'step' }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '12px', marginBottom: '16px', alignItems: 'start' }}>
              <span aria-hidden="true" style={{ fontSize: '26px', fontWeight: 300, color: '#000', lineHeight: 1.3 }}>{String(i + 1).padStart(2, '0')}</span>
              <span><span style={lead}>{it.lead} </span>{it.text}</span>
            </li>
          ))}
        </ol>
      );
    case 'facts':
      return (
        <dl style={{ ...body, margin: '0 0 28px', padding: '8px 0 0', borderTop: '1px solid #ccc' }}>
          {block.rows.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 160px) 1fr', gap: '16px', padding: '12px 0', borderBottom: '1px solid #ccc' }}>
              <dt style={{ ...cardLabel, margin: '4px 0 0' }}>{k}</dt>
              <dd style={{ margin: 0 }}>{v}</dd>
            </div>
          ))}
        </dl>
      );
    case 'table': {
      // Stacked cards: works at every width without stylesheet media queries.
      const [first, ...rest] = block.columns;
      return (
        <div style={{ display: 'grid', gap: '12px', margin: '0 0 28px' }}>
          {block.rows.map((row, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #ccc', padding: '20px 22px' }}>
              <p style={{ ...body, margin: '0 0 6px', fontWeight: 600, color: INK }}>{row[0]}</p>
              {rest.map((col, j) => (
                <p key={col} style={{ ...body, fontSize: '15px', margin: j === rest.length - 1 ? 0 : '0 0 8px' }}>
                  {rest.length > 1 && <span style={{ ...cardLabel, display: 'inline', marginRight: '8px' }}>{col}</span>}
                  {row[j + 1]}
                </p>
              ))}
            </div>
          ))}
        </div>
      );
    }
    case 'faq':
      return (
        <div style={{ margin: '0 0 12px' }}>
          {block.items.map((f) => (
            <div key={f.q} style={{ padding: '18px 0', borderTop: '1px solid #ccc' }}>
              <p style={{ ...body, margin: '0 0 6px', fontWeight: 600, color: INK }}>{f.q}</p>
              <p style={{ ...body, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function BuyersGuide({ track }) {
  const { slug } = useParams();
  const guide = guides[slug];
  const town = towns[slug];
  const styles = getStyles(false);
  const path = `/${slug}/buyers-guide`;
  const seo = guide ? pageMeta({ title: guide.title, description: guide.metaDescription, path, ogType: 'article' }) : null;
  const heroImage = guide?.hero ? `${SITE_URL}${guide.hero.src}.jpg` : `${SITE_URL}/nicholas-headshot.jpg`;

  useSeo(guide ? {
    ...seo,
    meta: [
      ...seo.meta,
      { property: 'og:image', content: heroImage },
      { name: 'twitter:image', content: heroImage },
    ],
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.heading,
        description: guide.metaDescription,
        datePublished: guide.publishedAt,
        dateModified: guide.modifiedAt || guide.publishedAt,
        url: SITE_URL + path,
        image: heroImage,
        author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Nicholas Liappas' },
        publisher: { '@type': 'Organization', name: 'Nicholas Liappas – The Liappas Team at Compass', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-black.png` } },
        about: { '@type': 'City', name: guide.town },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (guide.sections.find((s) => s.id === 'faq')?.blocks.find((b) => b.type === 'faq')?.items || []).map((f) => ({
          '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: guide.town, item: `${SITE_URL}/${slug}` },
          { '@type': 'ListItem', position: 3, name: 'Buyer’s Guide', item: SITE_URL + path },
        ],
      },
    ],
  } : { title: 'Page Not Found | Nicholas Liappas', meta: [{ name: 'robots', content: 'noindex' }] });

  if (!guide || !town) return <NotFound />;

  return (
    <div style={styles.container}>
      <section style={{ ...styles.hero, height: 'auto', minHeight: guide.hero ? '560px' : '480px', padding: '180px 24px 90px', background: '#000', textAlign: 'center' }}>
        {guide.hero && (
          <>
            <Photo src={guide.hero.src} small={guide.hero.small} alt={guide.hero.alt} eager position={guide.hero.position} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.5)', zIndex: 1 }} />
          </>
        )}
        <div style={{ ...styles.heroContent, textShadow: guide.hero ? '0 1px 14px rgba(0,0,0,0.6)' : 'none' }}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px', }}>
            <Link to={`/${slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{guide.town}</Link> · Buyer’s Guide
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.1, marginBottom: '20px' }}>{guide.heading}</h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', }}>{guide.subtitle}</p>
          <p style={{ fontFamily: FONT_SANS, fontSize: '12px', marginTop: '24px' }}>By Nicholas Liappas · Updated {guide.updated}</p>
        </div>
      </section>

      <article style={{ padding: '80px 5% 60px', background: '#fff' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ ...body, fontSize: '19px', lineHeight: 1.5, color: INK, marginBottom: '40px' }}>{guide.intro}</p>

          <nav aria-label="In this guide" style={{ background: '#fff', border: '1px solid #ccc', padding: '24px 28px', marginBottom: '56px' }}>
            <p style={{ ...cardLabel, margin: '0 0 10px' }}>In this guide</p>
            <ol style={{ ...body, margin: 0, padding: 0, listStyle: 'none', columns: 2, columnGap: '32px', fontSize: '14px', lineHeight: 1.5 }}>
              {guide.sections.map((sec) => (
                <li key={sec.id}><a href={`#${sec.id}`} style={{ color: INK, textDecoration: 'none', borderBottom: '1px solid #ccc' }}>{sec.heading}</a></li>
              ))}
            </ol>
          </nav>

          {guide.sections.map((sec) => (
            <section key={sec.id} id={sec.id} style={{ scrollMarginTop: '96px', margin: '0 0 56px' }}>
              <hr style={rule} />
              <h2 style={{ ...h2, marginTop: '36px' }}>{sec.heading}</h2>
              {sec.blocks.map((b, i) => <Block key={i} block={b} />)}
            </section>
          ))}

          {guide.sources?.length > 0 && (
            <section aria-label="Sources" style={{ margin: '0 0 24px' }}>
              <hr style={rule} />
              <p style={{ ...cardLabel, margin: '28px 0 10px' }}>Sources</p>
              <ul style={{ ...body, fontSize: '13px', lineHeight: 1.5, color: '#000', margin: 0, paddingLeft: '18px' }}>
                {guide.sources.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </section>
          )}
        </div>
      </article>

      <section id="contact" style={{ padding: '120px 5%', background: '#fff', borderTop: '1px solid #ccc', scrollMarginTop: '72px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={styles.sectionSubtitle}>Next step</p>
            <h2 style={styles.sectionTitle}>{guide.cta.heading}</h2>
            <p style={{ ...body, marginBottom: '32px' }}>{guide.cta.text}</p>
            <a href="tel:516-214-7761" onClick={() => track('phone_click', { placement: 'buyers_guide' })} style={{ fontFamily: FONT_SANS, fontSize: '14px', color: INK, textDecoration: 'none', }}>M: 516-214-7761</a>
          </div>
          <ContactForm track={track} formName="contact" />
        </div>
      </section>
    </div>
  );
}
