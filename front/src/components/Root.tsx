import { Outlet } from 'react-router-dom';

import ChatModal from '@/components/Chat/ChatModal';
import { AuthProvider } from '@/contexts/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <div className="overflow-hidden">
        <Outlet />
        <ChatModal />
      </div>
    </AuthProvider>
  );
}

export default Root;
