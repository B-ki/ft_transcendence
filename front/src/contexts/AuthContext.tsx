import jwtDecode from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';

import { setApiToken } from '@/utils/api';

interface AuthContextType {
  login?: string | undefined;
  login_42: () => void;
  logout: () => void;
  setLogin: (user: string | undefined) => void;
  setToken: (token: string | null) => void;
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<TokenDecoded | null>(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setLogin(decoded.login);
      } else {
        setToken(null);
      }
    }
    setInitialLoading(true);
  }, []);

  const login_42 = () => {
    console.log('CACA');
    window.location.href = `${window.location.origin}/api/auth/42`;
  };

  const logout = () => {
    setLogin(undefined);
    setToken(null);
  };

  const setToken = (token: string | null) => {
    localStorage.setItem('token', token || '');
    setApiToken(token);
  };

  return (
    <AuthContext.Provider value={{ login, login_42, logout, setLogin, setToken }}>
      {initialLoading && children}
    </AuthContext.Provider>
  );
}
