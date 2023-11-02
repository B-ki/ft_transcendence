import { createContext, useEffect, useMemo, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useLocation } from 'react-router-dom';

import { dummyUserDto, userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';

interface AuthContextType {
  user?: userDto | null;
  loading: boolean;
  error?: unknown;
  login_42: () => void;
  logout: () => void;
  setUser: (user: undefined | userDto) => void;
}

const fetchUserData = async (token: string | null) => {
  const response = await fetch(`/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  //const [user, setUser] = useState<userDto | null>(null);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false);

  // Add api
  //const user = useApi()

  /*
  const url: string = 'http://localhost:8080/api/';

  const base = ky.create({ prefixUrl: url });

  const token = localStorage.getItem('token');

  // Refaire la condition au moment ou le user est set, Défaire si user est set undefined
  const api = token ? base.extend({ headers: { Authorization: `Bearer ${token}` } }) : base;
  */

  // const history = useHistory();
  const location = useLocation();

  const token = localStorage.getItem('token');
  // const { data, isError, isLoading } = useApi().get('get user profile', '/user/me', {
  //   options: {
  //     enabled: !!token,
  //   },
  // }) as UseQueryResult<userDto>;

  const query = useQuery('userData', () => fetchUserData(token), {
    enabled: !!token,
  });

  let user = query.data;
  /*
  useEffect(() => {
    console.log('[AuthContext] fetching User');
    if (data) setUser(data);
  });*/

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

  const setUser = (newUser: userDto | undefined) => {
    user = newUser;
  };

  const logout = () => {
    //setUser(null);
    user = undefined;
    localStorage.setItem('token', ''); // Guards redirect to Homepage directly
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
