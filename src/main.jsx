import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Automatic recovery for stale browser chunk caches after new deployments
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('New deployment detected, reloading to fetch fresh bundle...', event);
    window.location.reload();
  });

  window.addEventListener('error', (e) => {
    if (e?.message && (e.message.includes('dynamically imported module') || e.message.includes('Loading chunk'))) {
      const lastReload = sessionStorage.getItem('pnd_last_chunk_reload');
      const now = Date.now();
      if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
        sessionStorage.setItem('pnd_last_chunk_reload', now.toString());
        window.location.reload();
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
