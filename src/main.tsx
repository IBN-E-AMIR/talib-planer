import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './store';
import { I18nProvider } from './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </AppProvider>
  </StrictMode>
);
