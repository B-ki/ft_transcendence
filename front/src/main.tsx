import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from '@/components/Root';
import Error from '@/pages/Error';
import Login from '@/pages/Login';
import Private from '@/pages/Private';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Friends from '@/pages/Friends';
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
        path: '',
        element: <Login />,
      },
      {
        path: '/home',
        element: <Home />,
        loader: privateGuard,
      },
      {
        path: '/profile',
        element: <Profile />,
        loader: privateGuard,
      },
      {
        path: '/friends',
        element: <Friends />,
        loader: privateGuard,
      },
      {
        path: 'private',
        element: <Private />,
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
