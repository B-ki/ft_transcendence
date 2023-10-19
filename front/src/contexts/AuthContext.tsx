import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@/contexts/userInterface';
import { useApi } from '@/hooks/useApi';
import jwt_decode from "jwt-decode";


interface AuthContextType {
  user?: User;
  loading: boolean;
  error?: unknown;
  login_42: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }): 
JSX.Element {
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

  //setLoadingInitial(false); 

  useEffect(() => {
    // TODO: Fetch user data from API if token in localStorage
    const token = getItem('token');

    if (token) {
      // VALIDATE TOKEN
      let decodedToken = jwt_decode(token);
      console.log("Decoded Token", decodedToken);
      let currentDate = new Date();
      
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log("Token expired.");
      } else {
        console.log("Valid token");

      }

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
    const { user } = useApi().get('')
    setUser({
      id: '1',
      username: 'username',
      email: 'email,'
      //token: token,
    });
    //setItem('token', token);
    // TODO: Login user with API
    // TODO: Save user info and token in localStorage
    // TODO: set error if login fails
    setLoading(false); // TODO: Put in the 'finally' block of the fetch
  };

  // IF LOGIN BY EMAIL AND PASSWORD ALLOWED, DO : login, register

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
      login_42,
      logout,
      //login,
      //register,
    }),
    [user, loading, error, login_42, /*login_42, register,*/ logout],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
}
