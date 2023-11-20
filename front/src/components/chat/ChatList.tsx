// import logo from '@/assets/logo.svg';

import { ChannelType } from './Chat';

interface ChatListElemProps {
  chatInfos: ChannelType;
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
}

const ChatListElem = ({ chatInfos, setCurrentChannel, currentChannel }: ChatListElemProps) => {
  const handleClick = (channel: ChannelType) => {
    if (currentChannel === null || channel.id !== currentChannel.id) setCurrentChannel(channel);
  };

  return (
    <button
      onClick={() => handleClick(chatInfos)}
      className="flex w-full cursor-pointer p-3 hover:bg-white-2"
    >
      {/* <img src={chatInfos.profilePicture} alt="conversation" className="h-14 w-14 rounded-full" /> */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h3 className="font-bold">{chatInfos.name}</h3>
          {/* <h3 className="text-sm">@{chatInfos.login}</h3> */}
        </div>
        {/* <span className="text-sm">{chatInfos.lastMessage}</span> */}
      </div>
    </button>
  );
};

interface ChatListProps {
  joinedChannels: ChannelType[];
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
}

const ChatList = ({ joinedChannels, currentChannel, setCurrentChannel }: ChatListProps) => {
  return (
    <div className="h-full w-full">
      {joinedChannels.map((chat) => (
        <ChatListElem
          setCurrentChannel={setCurrentChannel}
          key={chat.id}
          chatInfos={chat}
          currentChannel={currentChannel}
        />
      ))}
    </div>
  );
};

export default ChatList;
