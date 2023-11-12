import { redirect } from 'react-router-dom';

export async function privateGuard() {
  const token = localStorage.getItem('token');
  // TODO: decode jwt token and check if it's expired. Check also if 2FA ?
  if (!token) {
    throw redirect('/login');
  }
  return null;
}
