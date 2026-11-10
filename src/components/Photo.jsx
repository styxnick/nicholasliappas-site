import { useState } from 'react';

const FALLBACK = '#ccc';

// <picture> with webp + jpg sources that degrades to a flat grey box when the
// file is missing or fails to load. `src` is the path without extension.
// `small` (optional) is a phone-sized variant of the same photo, served below 768px.
// `position` (optional) is the CSS object-position used when the photo is cropped to fit.
export default function Photo({ src, alt, style, eager = false, small = null, position = 'center' }) {
  const [failed, setFailed] = useState(!src);
  const box = { position: 'relative', overflow: 'hidden', background: FALLBACK, ...style };
  if (failed) return <div aria-hidden="true" style={box} />;
  return (
    <div style={box}>
      <picture>
        {small && <source media="(max-width: 768px)" srcSet={`${small}.webp`} type="image/webp" />}
        {small && <source media="(max-width: 768px)" srcSet={`${small}.jpg`} />}
        <source srcSet={`${src}.webp`} type="image/webp" />
        <img src={`${src}.jpg`} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
             onError={() => setFailed(true)}
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, display: 'block' }} />
      </picture>
    </div>
  );
}
