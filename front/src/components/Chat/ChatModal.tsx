/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';

import { ReactComponent as ChatPlus } from '@/assets/icons/chat_plus.svg';
import { ReactComponent as ExpandDown } from '@/assets/icons/expand_down.svg';
import { ReactComponent as ExpandUp } from '@/assets/icons/expand_up.svg';

import ChatList from './ChatList';

function ChatModal() {
  const [chatExpanded, setChatExpanded] = useState<boolean>(false);

  return (
    <div
      className={`absolute bottom-0 right-12 z-10 h-[500px] w-[400px] transition duration-300 ease-in-out ${
        chatExpanded ? 'translate-y-0' : 'translate-y-[448px]'
      } rounded-t-2xl bg-white-1 shadow-2xl`}
    >
      <div
        className="flex h-[52px] cursor-pointer items-center justify-between px-3 py-2"
        onClick={() => setChatExpanded(!chatExpanded)}
      >
        <h2 className="text-xl font-bold text-primary">Messages</h2>
        <div className="flex gap-2">
          <button className="rounded-full p-1 hover:bg-white-2">
            <ChatPlus className="h-7 w-7" />
          </button>
          <button className="rounded-full p-1 hover:bg-white-2">
            {chatExpanded ? <ExpandDown className="h-7 w-7" /> : <ExpandUp className="h-7 w-7" />}
          </button>
        </div>
      </div>
      {chatExpanded && (
        <div className="h-[448px]">
          <ChatList />
        </div>
      )}
    </div>
  );
}

export default ChatModal;
