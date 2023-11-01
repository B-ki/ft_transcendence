import { createContext, useEffect, useMemo, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useLocation } from 'react-router-dom';

import { dummyUserDto, userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  user?: userDto | null;
  loading: boolean;
  error?: unknown;
  login_42: () => void;
  logout: () => void;
  setUser: (user: null | userDto) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<userDto | null>(null);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false);

  const { removeItem } = useLocalStorage();

  // const history = useHistory();
  const location = useLocation();

  const { data, isError, isLoading } = useApi().get(
    'get user profile',
    '/user/me',
  ) as UseQueryResult<userDto>;

  useEffect(() => {
    console.log('[AuthContext] fetching User');
    if (data) setUser(data);
  });

  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  useEffect(() => {
    setLoadingInitial(false);
  }, []);

  /* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Remove warning once done
  const login_42 = () => {
    setLoading(true);
    window.location.href = `${window.location.origin}/api/auth/42`;
    setLoading(false); // TODO: Put in the 'finally' block of the fetch
  };

  // IF LOGIN BY EMAIL AND PASSWORD ALLOWED, DO : login, register

  const logout = () => {
    setUser(null);
    removeItem('token'); // Guards redirect to Homepage directly
  };

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login_42,
      logout,
      setUser,
    }),
    [user, loading, error, login_42, logout, setUser],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
}
