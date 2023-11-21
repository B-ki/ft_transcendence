import { Button } from '@/components/Button';
import { FriendList } from '@/components/FriendList';
import Chat from '@/components/chat/Chat';

const Friends = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="flex gap-3"></div>
      <Chat />
    </div>
  );
};

export default Friends;
