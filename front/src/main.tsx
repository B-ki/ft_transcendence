import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from '@/components/Root';
import Error from '@/pages/Error';
import Login from '@/pages/Login';
import Private from '@/pages/Private';
import { privateGuard } from '@/utils/privateGuard';
import OauthCallback from './pages/OauthCallback';
import Home from './pages/Home';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '',
        element: <Home />,
        loader: privateGuard,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'private',
        element: <Private />,
        loader: privateGuard,
      },
      {
        path: 'oauth-callback',
        element: <OauthCallback />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
