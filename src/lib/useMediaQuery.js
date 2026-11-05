import { useCallback, useSyncExternalStore } from 'react';

// Subscribe to a CSS media query. Used because all styling is inline
// (no stylesheet media queries), e.g. to switch the nav to a mobile menu.
//
// Server snapshot is always `false`, so prerendered HTML (scripts/prerender.mjs)
// and the first hydration pass agree; React then re-renders with the real value.
// Anything that must look right *before* hydration (the nav bar, the
// commercial grids) uses the CSS media queries in index.html instead.
export function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
