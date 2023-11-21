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
import User from './pages/User';
import { privateGuard } from '@/utils/privateGuard';

import Main from './components/Main';
import OauthCallback from './pages/OauthCallback';
import TwoFaActivation from './pages/TwoFaActivation';
import TwoFaLogin from './pages/TwoFaLogin';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        element: <Main />,
        children: [
          {
            path: '/',
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
          {
            path: '/2fa',
            element: <TwoFaActivation />,
            loader: privateGuard,
          },
          {
            path: '/user/:login',
            element: <User />,
            loader: privateGuard,
          },
        ],
      },
      {
        path: '/oauth-callback',
        element: <OauthCallback />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/2falogin',
        element: <TwoFaLogin />,
      },
    ],
  },
]);

export const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
