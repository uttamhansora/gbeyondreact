import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { initSmoothScroll } from './utils/smoothScroll';

import './styles/wnChrome.css';

initSmoothScroll();

ReactDOM.createRoot(
  document.getElementById('react-root')
).render(
  <App />
);