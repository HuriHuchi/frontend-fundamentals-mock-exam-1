import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-loading-skeleton/dist/skeleton.css';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <GlobalStyles />
        <GlobalPortal.Provider>
          <Routes />
        </GlobalPortal.Provider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
