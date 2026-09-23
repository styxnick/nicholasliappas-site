import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to top on route change, or to the #hash target when one is present
// (e.g. /#contact from a town page). Sections with ids carry an inline
// scrollMarginTop so the fixed nav doesn't cover them.
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts++ < 10) {
        requestAnimationFrame(tryScroll);
      }
    };
    requestAnimationFrame(tryScroll);
  }, [pathname, hash, key]);

  return null;
}
