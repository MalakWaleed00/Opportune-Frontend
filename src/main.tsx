import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; // Path fixed to look inside the styles folder
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);