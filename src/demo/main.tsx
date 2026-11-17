import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { ConfirmHost } from '@/components';
import { getTheme, setTheme } from '@/lib/theme';
import { Demo } from './Demo';
import './demo.css';

setTheme(getTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
    <ConfirmHost />
    <Toaster richColors position="top-right" />
  </StrictMode>,
);
