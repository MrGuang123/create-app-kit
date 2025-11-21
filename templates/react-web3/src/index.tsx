import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { AppProviders } from './providers';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
