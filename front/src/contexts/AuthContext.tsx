import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext, useEffect, useMemo, useState } from 'react';
import { redirect, useLocation } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import jwt_decode from 'jwt-decode';
import ApiClient from '@/utils/apiAxios';
import { userDto } from '@/dto/userDto';
import { jwtToken } from '@/dto/jwtToken';

interface AuthContextType {
  user?: userDto;
  loading: boolean;
  error?: unknown;
  login_42: () => void;
  logout: () => void;
  settingUser: (user: Promise<void | userDto>) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const [user, setUser] = useState<null | userDto>(null);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false);

  const { getItem, setItem, removeItem } = useLocalStorage();

  // const history = useHistory();
  const location = useLocation();

  /*const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = jwt_decode<jwtToken>(token);
    console.log('login :', decodedToken.username);
    //const { data: userData } = useApi().get('get user', `user/id/${decodedToken.username}`);
    //const userData = getUser(decodedToken.username);
    //console.log('userData', userData);
    //const userType = userData as userDto;
  }
  //console.log('user state:', user);
  */

  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  useEffect(() => {
    setLoadingInitial(false);
  }, []);

  /* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: Remove warning once done
  const login_42 = () => {
    setLoading(true);
    const token = getItem('token');
    window.location.href = `${window.location.origin}/api/auth/42`;
    setLoading(false); // TODO: Put in the 'finally' block of the fetch
  };

  const settingUser = async (user: Promise<void | userDto>) => {
    if (user) {
      setUser(user);
    }
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
