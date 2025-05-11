import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

import { Providers } from './provider';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Providers>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#fff',
              color: '#363636',
              border: '1px solid #eaeaea',
              padding: '16px',
              borderRadius: '8px',
            },
          }}
        />
        </Providers>
      </BrowserRouter>
    </QueryClientProvider>
    
  </StrictMode>
);