import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/pages/Home';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
