import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import TownPage from './pages/TownPage';
import HomeValuation from './pages/HomeValuation';
import NotFound from './pages/NotFound';
import ScrollManager from './components/ScrollManager';
import { getStyles } from './components/styles';

// Set to your Meta Pixel ID (e.g. '1234567890') to enable Facebook tracking. Leave empty to disable.
const FB_PIXEL_ID = '';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    // Google Analytics
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1FTQ8KS469';
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-1FTQ8KS469');
  }, []);

  useEffect(() => {
    // Facebook Pixel (only loads when FB_PIXEL_ID is set)
    if (!FB_PIXEL_ID) return;
    const pixel = document.createElement('script');
    pixel.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(pixel);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + FB_PIXEL_ID + '&ev=PageView&noscript=1" />';
    document.body.appendChild(noscript);
  }, []);

  const trackEvent = (action, category, label) => {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }

    // Facebook Pixel tracking
    if (window.fbq) {
      if (action === 'form_submit') {
        window.fbq('track', 'Lead');
      } else if (action === 'click') {
        window.fbq('track', 'ViewContent');
      }
    }
  };

  const styles = getStyles(isScrolled);

  return (
    <div style={styles.container}>
      <ScrollManager />
      <Nav trackEvent={trackEvent} />
      <Routes>
        <Route path="/" element={<Home trackEvent={trackEvent} />} />
        <Route path="/home-valuation" element={<HomeValuation trackEvent={trackEvent} />} />
        <Route path="/:slug" element={<TownPage trackEvent={trackEvent} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer trackEvent={trackEvent} />
    </div>
  );
}
