import { Outlet } from 'react-router-dom';

import background from '@/assets/layeredWavesBg.svg';
import { AuthProvider } from '@/contexts/AuthContext';

import { Navbar } from './Navbar';

function Main() {
  return (
    <AuthProvider>
      <Navbar />
      <main
        className="h-screen pt-16"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Outlet />
      </main>
    </AuthProvider>
  );
}

export default Main;
