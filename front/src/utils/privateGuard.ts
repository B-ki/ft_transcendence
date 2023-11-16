import jwtDecode from 'jwt-decode';
import { redirect } from 'react-router-dom';

interface TokenDecoded {
  login: string;
  isTwoFaEnabled: boolean;
  isTwoFaAuthenticated: boolean;
  iat: number;
  exp: number;
}

export async function privateGuard() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw redirect('/login');
  }

  const decoded = jwtDecode<TokenDecoded | null>(token);

  if (!decoded || decoded.exp * 1000 < Date.now()) {
    throw redirect('/login');
  } else if (decoded.isTwoFaEnabled && decoded.isTwoFaAuthenticated === false) {
    throw redirect('/2falogin');
  } else {
    return null;
  }
}
