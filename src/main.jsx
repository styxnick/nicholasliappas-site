import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Every route is prerendered at build time (scripts/prerender.mjs), so the
// container normally already holds the page: hydrate it instead of re-rendering.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
