import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from '@/components/Root';
import Error from '@/pages/Error';
import Home from '@/pages/Home';
import Private from '@/pages/Private';
import Register from '@/pages/Register';
import { privateGuard } from '@/utils/privateGuard';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: 'app',
        element: <Home />,
      },
      {
        path: 'private',
        element: <Private />,
        loader: privateGuard,
      },
      {
        path: 'register',
        element: <Register />,
        loader: privateGuard,
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
