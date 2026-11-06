import { useParams, Link } from 'react-router-dom';
import { guides } from '../data/guides';
import { towns } from '../data/towns';
import { getStyles, FONT_SANS } from '../components/styles';
import ContactForm from '../components/ContactForm';
import NotFound from './NotFound';
import { useSeo, pageMeta, SITE_URL } from '../lib/seo';

const INK = '#1a1a1a';
const body = { fontFamily: FONT_SANS, fontSize: '16px', lineHeight: 1.9, color: '#3a3a3a', margin: '0 0 20px' };
const lead = { fontWeight: 600, color: INK };
const h2 = { fontSize: 'clamp(28px, 4vw, 34px)', fontWeight: 400, letterSpacing: '1px', lineHeight: 1.2, margin: '0 0 22px', color: INK };
const h3 = { fontSize: '22px', fontWeight: 400, letterSpacing: '0.5px', margin: '40px 0 14px', color: INK };
const rule = { border: 0, borderTop: '1px solid #e8e8e4', margin: '0' };
const cardLabel = { fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#707070', margin: '0 0 4px' };

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
              <span>{it.lead && <span style={lead}>{it.lead} </span>}{it.text}</span>
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol style={{ ...body, listStyle: 'none', padding: 0, margin: '0 0 24px', counterReset: 'step' }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '12px', marginBottom: '16px', alignItems: 'start' }}>
              <span aria-hidden="true" style={{ fontSize: '26px', fontWeight: 300, color: '#8c8c8c', lineHeight: 1.3 }}>{String(i + 1).padStart(2, '0')}</span>
              <span><span style={lead}>{it.lead} </span>{it.text}</span>
            </li>
          ))}
        </ol>
      );
    case 'facts':
      return (
        <dl style={{ ...body, margin: '0 0 28px', padding: '8px 0 0', borderTop: '1px solid #e8e8e4' }}>
          {block.rows.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 160px) 1fr', gap: '16px', padding: '12px 0', borderBottom: '1px solid #e8e8e4' }}>
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
            <div key={i} style={{ background: '#fafafa', padding: '20px 22px' }}>
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
            <div key={f.q} style={{ padding: '18px 0', borderTop: '1px solid #e8e8e4' }}>
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

  useSeo(guide ? {
    ...seo,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.heading,
        description: guide.metaDescription,
        datePublished: guide.publishedAt,
        dateModified: guide.modifiedAt || guide.publishedAt,
        url: SITE_URL + path,
        image: `${SITE_URL}/nicholas-headshot.jpg`,
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
      <section style={{ ...styles.hero, height: 'auto', minHeight: '480px', padding: '180px 24px 90px', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)', textAlign: 'center' }}>
        <div style={styles.heroContent}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', opacity: 0.7 }}>
            <Link to={`/${slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{guide.town}</Link> · Buyer’s Guide
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 300, letterSpacing: '3px', lineHeight: 1.1, marginBottom: '20px' }}>{guide.heading}</h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.9 }}>{guide.subtitle}</p>
          <p style={{ fontFamily: FONT_SANS, fontSize: '12px', letterSpacing: '1px', opacity: 0.6, marginTop: '24px' }}>By Nicholas Liappas · Updated {guide.updated}</p>
        </div>
      </section>

      <article style={{ padding: '80px 5% 60px', background: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ ...body, fontSize: '19px', lineHeight: 1.8, color: INK, marginBottom: '40px' }}>{guide.intro}</p>

          <nav aria-label="In this guide" style={{ background: '#fafafa', padding: '24px 28px', marginBottom: '56px' }}>
            <p style={{ ...cardLabel, margin: '0 0 10px' }}>In this guide</p>
            <ol style={{ ...body, margin: 0, padding: 0, listStyle: 'none', columns: 2, columnGap: '32px', fontSize: '14px', lineHeight: 2.1 }}>
              {guide.sections.map((sec) => (
                <li key={sec.id}><a href={`#${sec.id}`} style={{ color: INK, textDecoration: 'none', borderBottom: '1px solid #d8d8d4' }}>{sec.heading}</a></li>
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
              <ul style={{ ...body, fontSize: '13px', lineHeight: 1.8, color: '#6b6b6b', margin: 0, paddingLeft: '18px' }}>
                {guide.sources.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </section>
          )}
        </div>
      </article>

      <section id="contact" style={{ padding: '120px 5%', background: '#f8f8f8', scrollMarginTop: '72px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={styles.sectionSubtitle}>Next step</p>
            <h2 style={styles.sectionTitle}>{guide.cta.heading}</h2>
            <p style={{ ...body, marginBottom: '32px' }}>{guide.cta.text}</p>
            <a href="tel:516-214-7761" onClick={() => track('phone_click', { placement: 'buyers_guide' })} style={{ fontFamily: FONT_SANS, fontSize: '14px', color: INK, textDecoration: 'none', letterSpacing: '1px' }}>M: 516-214-7761</a>
          </div>
          <ContactForm track={track} formName="contact" />
        </div>
      </section>
    </div>
  );
}
