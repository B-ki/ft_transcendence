import { redirect } from 'react-router-dom';

export async function privateGuard() {
  const token = localStorage.getItem('token');
  // TODO: decode jwt token and check if it's expired
  if (!token) {
    throw redirect('/app');
  }
  return null;
}
