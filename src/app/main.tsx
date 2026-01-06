import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';

async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import('@/shared/api/mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
    </StrictMode>,
  );
});
