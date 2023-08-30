import React from 'react';

interface ChatListElemProps {
  chatInfos: {
    username: string;
    login: string;
    profilePicture: string;
    lastMessage: string;
  };
}

// TODO: take props for the conversation
function ChatListElem({ chatInfos }: ChatListElemProps) {
  return (
    <div className="flex w-full p-3 hover:bg-white-2">
      <img src={chatInfos.profilePicture} alt="conversation" className="w-14 rounded-full" />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h3 className="font-bold">{chatInfos.username}</h3>
          <h3 className="text-sm">@{chatInfos.login}</h3>
        </div>
        <span className="text-sm">{chatInfos.lastMessage}</span>
      </div>
    </div>
  );
}

export default ChatListElem;
