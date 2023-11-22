import jwtDecode from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { setApiToken } from '@/utils/api';

interface AuthContextType {
  login?: string | undefined;
  login_42: () => void;
  logout: () => void;
  setLogin: (user: string | undefined) => void;
  setToken: (token: string | null) => void;
  socket?: Socket;
}

interface TokenDecoded {
  login: string;
  iat: number;
  exp: number;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [login, setLogin] = useState<string | undefined>(undefined);
  const [socket, setSocket] = useState<Socket>();

  const connectNotifySocket = (token: string | null) => {
    if (!token) {
      return;
    }

    const newSocket = io('/notify', { extraHeaders: { token: token } });
    newSocket.on('connect', () => {
      console.log('Notify socket connected');
      setSocket(newSocket);
    });
    newSocket.on('disconnect', () => {
      console.log('Notify socket disconnected');
      setSocket(undefined);
    });
  };

  const setToken = (token: string | null) => {
    localStorage.setItem('token', token || '');
    setApiToken(token);
    connectNotifySocket(token);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<TokenDecoded | null>(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setLogin(decoded.login);
        connectNotifySocket(token);
      } else {
        setToken(null);
      }
    }
    setInitialLoading(true);
  }, []);

  const login_42 = () => {
    window.location.href = `${window.location.origin}/api/auth/42/login`;
  };

  const logout = () => {
    socket?.disconnect();
    setLogin(undefined);
    setToken(null);
    setSocket(undefined);
  };

  return (
    <AuthContext.Provider value={{ login, login_42, logout, setLogin, setToken, socket }}>
      {initialLoading && children}
    </AuthContext.Provider>
  );
}
