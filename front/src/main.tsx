import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from '@/components/Root';
import Error from '@/pages/Error';
import Friends from '@/pages/Friends';
import Game from '@/pages/Game';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import { privateGuard } from '@/utils/privateGuard';

import OauthCallback from './pages/OauthCallback';

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
        path: '/oauth-callback',
        element: <OauthCallback />,
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
        path: '/game',
        element: <Game />,
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
