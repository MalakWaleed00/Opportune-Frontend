import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import the Router
import './styles/index.css';
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Wrap your App in the Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);