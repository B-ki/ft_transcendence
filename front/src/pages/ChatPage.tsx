import { Button } from '@/components/Button';
import Chat from '@/components/chat/Chat';
import FriendList from '@/components/FriendList';

const ChatPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      <div className="flex gap-3"></div>
      <FriendList></FriendList>
      <Chat />
    </div>
  );
};

export default ChatPage;
