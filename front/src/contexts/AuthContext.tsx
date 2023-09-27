import { createContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useLocalStorage } from '@/hooks/useLocalStorage';

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user?: User;
  loading: boolean;
  error?: unknown;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  const { getItem, setItem, removeItem } = useLocalStorage();

  // const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  // useQuery instead ?
  useEffect(() => {
    // TODO: Fetch user data from API if token in localStorage
    const token = getItem('token');
    if (token) {
      // TODO: Validate token here
      setUser({
        id: '1',
        username: 'apigeon',
        email: 'apigeon@42.fr',
        token: token,
      });
    }
    setLoadingInitial(false); // TODO: Put in the 'finally' block of the fetch
  }, []);

  /* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Remove warning once done
  const login = () => {
    setLoading(true);
    // TODO: use 42 OAuth to login user with API
    setLoading(false); // TODO: Put in the 'finally' block of the fetch
  };

  const logout = () => {
    setUser(undefined);
    removeItem('token');
    // TODO: redirect to Home page
  };

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error, login, logout],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
}
