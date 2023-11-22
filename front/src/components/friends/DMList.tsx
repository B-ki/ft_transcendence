// import logo from '@/assets/logo.svg';

import { ChannelType } from './DM';

interface DMListElemProps {
  DMInfos: ChannelType;
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
}

const DMListElem = ({ DMInfos, setCurrentChannel, currentChannel }: DMListElemProps) => {
  const handleClick = (channel: ChannelType) => {
    if (currentChannel === null || channel.id !== currentChannel.id) setCurrentChannel(channel);
  };

  return (
    <button
      onClick={() => handleClick(DMInfos)}
      className={`flex w-full cursor-pointer p-3 enabled:hover:bg-white-2 ${
        currentChannel?.name === DMInfos.name && 'bg-white-3'
      }`}
      disabled={currentChannel?.name === DMInfos.name}
    >
      {/* <img src={DMInfos.profilePicture} alt="DMConversation" className="h-14 w-14 rounded-full" /> */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h3 className="font-bold">{DMInfos.name}</h3>
          {/* <h3 className="text-sm">@{DMInfos.login}</h3> */}
        </div>
        {/* <span className="text-sm">{DMInfos.lastDMMessage}</span> */}
      </div>
    </button>
  );
};

interface DMListProps {
  joinedChannels: ChannelType[];
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
}

const DMList = ({ joinedChannels, currentChannel, setCurrentChannel }: DMListProps) => {
  return (
    <div className="h-full w-full overflow-y-auto" style={{ maxHeight: '600px' }}>
      {joinedChannels.map((chat) => (
        <DMListElem
          setCurrentChannel={setCurrentChannel}
          key={chat.id}
          DMInfos={chat}
          currentChannel={currentChannel}
        />
      ))}
    </div>
  );
};

export default DMList;
