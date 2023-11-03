import { Outlet } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default Root;
