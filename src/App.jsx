import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import TownPage from './pages/TownPage';
import HomeValuation from './pages/HomeValuation';
import Commercial from './pages/Commercial';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { getStyles } from './components/styles';
import { initAnalytics, trackPageView, track } from './lib/analytics';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const styles = getStyles(false);

  return (
    <div style={styles.container}>
      <ScrollManager />
      <Nav track={track} />
      <Routes>
        <Route path="/" element={<Home track={track} />} />
        <Route path="/home-valuation" element={<HomeValuation track={track} />} />
        <Route path="/commercial" element={<Commercial track={track} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/:slug" element={<TownPage track={track} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer track={track} />
    </div>
  );
}
