// import logo from '@/assets/logo.svg';

import { userDto } from '@/dto/userDto';

import { ChannelType } from './Chat';

interface DmListElemProps {
  allUsers: userDto[] | undefined;
  chatInfos: ChannelType;
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
  me: userDto | undefined;
}

const DmListElem = ({
  chatInfos,
  setCurrentChannel,
  currentChannel,
  allUsers,
  me,
}: DmListElemProps) => {
  const handleClick = (channel: ChannelType) => {
    if (currentChannel === null || channel.id !== currentChannel.id) setCurrentChannel(channel);
  };
  let user;

  function findUserInfos(chatName: string) {
    chatName = chatName.substring(1);
    const names = chatName.split('_');
    if (names[0] === me?.login) {
      user = allUsers?.filter((user) => user.login === names[1]);
      if (user) return user[0].displayName ? user[0].displayName : user[0]?.login;
    } else {
      user = allUsers?.filter((user) => user.login === names[0]);
      if (user) return user[0].displayName ? user[0].displayName : user[0]?.login;
    }
    return '';
  }

  return (
    <button
      onClick={() => handleClick(chatInfos)}
      className={`flex w-full cursor-pointer p-3 enabled:hover:bg-white-2 ${
        currentChannel?.name === chatInfos.name && 'bg-white-3'
      }`}
      disabled={currentChannel?.name === chatInfos.name}
    >
      {/* <img src={chatInfos.profilePicture} alt="conversation" className="h-14 w-14 rounded-full" /> */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h3 className="font-bold">{findUserInfos(chatInfos.name)}</h3>
          {/* <h3 className="text-sm">@{chatInfos.login}</h3> */}
        </div>
        {/* <span className="text-sm">{chatInfos.lastMessage}</span> */}
      </div>
    </button>
  );
};

interface DmListProps {
  allUsers: userDto[] | undefined;
  joinedChannels: ChannelType[];
  currentChannel: ChannelType | null;
  setCurrentChannel: (channel: ChannelType) => void;
  me: userDto | undefined;
}

const DmList = ({
  joinedChannels,
  currentChannel,
  setCurrentChannel,
  allUsers,
  me,
}: DmListProps) => {
  return (
    <div className="h-full w-full overflow-y-auto" style={{ maxHeight: '600px' }}>
      {joinedChannels.map((chat) => (
        <DmListElem
          me={me}
          setCurrentChannel={setCurrentChannel}
          allUsers={allUsers}
          key={chat.id}
          chatInfos={chat}
          currentChannel={currentChannel}
        />
      ))}
    </div>
  );
};

export default DmList;
