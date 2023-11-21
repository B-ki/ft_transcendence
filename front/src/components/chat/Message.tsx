import React from 'react';
import Linkify from 'react-linkify';
import { Link } from 'react-router-dom';

import { UserType } from './Conversation';

interface MessageProps {
  sender: UserType;
  text: string;
  send_by_user: boolean;
}

const Message = ({ text, sender, send_by_user }: MessageProps) => {
  return (
    <div
      className={`w-fit max-w-[60%] whitespace-normal break-all rounded-lg p-2 ${
        send_by_user ? 'self-end bg-darkBlue-2 text-white-1' : 'self-start bg-white-3'
      }`}
    >
      <Link to={'/user/' + sender.login}>
        <div className="flex gap-1 font-bold">
          <img className="w-8 rounded-full" src={sender.intraImageURL} alt="user" />
          <span className="text-lg">{sender.login}</span>
        </div>
      </Link>
      <Linkify
        componentDecorator={(decoratedHref, decoratedText, key) => (
          <Link to={decoratedHref} key={key} style={{ color: '#3182CE' }}>
            {decoratedText}
          </Link>
        )}
      >
        <p>{text}</p>
      </Linkify>
    </div>
  );
};

export default Message;
