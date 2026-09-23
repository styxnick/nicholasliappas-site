import { useEffect, useState } from 'react';

// Subscribe to a CSS media query. Used because all styling is inline
// (no stylesheet media queries), e.g. to switch the nav to a mobile menu.
export function useMediaQuery(query) {
  const getMatch = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
