import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RouterApp from './RouterApp';      // ← NEW wrapper (App + /vendor-book routes)
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>
);

// Optional performance logging (same as before)
reportWebVitals();
