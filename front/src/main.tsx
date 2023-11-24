import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from '@/components/Root';
import Error from '@/pages/Error';
import Game from '@/pages/Game';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import { privateGuard } from '@/utils/privateGuard';

import Main from './components/Main';
import ChatPage from './pages/ChatPage';
import Friends from './pages/Friends';
import OauthCallback from './pages/OauthCallback';
import TwoFaActivation from './pages/TwoFaActivation';
import TwoFaLogin from './pages/TwoFaLogin';
import User from './pages/User';

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
        loader: privateGuard,
        children: [
          {
            path: '/',
            element: <Home />,
          },

          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/chat',
            element: <ChatPage />,
          },
          {
            path: '/game',
            element: <Game />,
          },
          {
            path: '/2fa',
            element: <TwoFaActivation />,
          },
          {
            path: '/user/:login',
            element: <User />,
          },
          {
            path: '/friends',
            element: <Friends />,
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
