import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import App from './ui/App';

declare global {
  interface Window {
    vscodeApi?: { postMessage: (msg: unknown) => void };
  }
}

function NavBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || typeof msg !== 'object') return;
      const command = (msg as any).command;
      if (command === 'navigate' && (msg as any).data?.path) {
        navigate((msg as any).data.path);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter initialEntries={['/']}>
      <NavBridge />
      <App />
    </MemoryRouter>
  </StrictMode>
);

