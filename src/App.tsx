import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import { useAuthStore } from './store/auth';
import Login from './components/Login';

const queryClient = new QueryClient();

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {token ? <Dashboard /> : <Login />}
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;