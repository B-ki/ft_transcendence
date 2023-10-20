import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext, useEffect, useMemo, useState } from 'react';
import { redirect, useLocation } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import jwt_decode from 'jwt-decode';
import ApiClient from '@/utils/apiAxios';
import { User } from '@/dto/userInterface';

interface AuthContextType {
  user?: User;
  loading: boolean;
  error?: unknown;
  login_42: () => void;
  logout: () => void;
  settingUser: (user: Promise<void | User>) => void;
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

  useEffect(() => {
    // TODO: Fetch user data from API if token in localStorage
    const token = getItem('token');

    if (token) {
      let decodedToken = jwt_decode(token);
      console.log('Decoded Token', decodedToken);
      let currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log('Token expired.');
      } else {
        console.log('Valid token');
      }

      //ApiClient.getInstance().get('/user/login');

      const login = getItem('login');
      setUser({
        login: 'apigeon',
        first_name: 'arthur',
        last_name: 'pigeon',
        email: 'apigeon@42.fr',
        imageURL: 'nimp',
        //token: token,
      });
    }
    setLoadingInitial(false); // TODO: Put in the 'finally' block of the fetch
  }, []);

  /* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Remove warning once done
  const login_42 = () => {
    setLoading(true);
    const token = getItem('token');
    window.location.href = `${window.location.origin}/api/auth/42`;
    setLoading(false); // TODO: Put in the 'finally' block of the fetch
  };

  const settingUser = (user: Promise<void | User>) => {
    setUser(user);
  };

  // IF LOGIN BY EMAIL AND PASSWORD ALLOWED, DO : login, register

  const logout = () => {
    setUser(undefined);
    removeItem('token'); // Guards redirect to Homepage directly
  };

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login_42,
      logout,
      settingUser,
      //login,
      //register,
    }),
    [user, loading, error, login_42, /*login_42, register,*/ logout, settingUser],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
}
