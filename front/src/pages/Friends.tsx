import React from 'react';

import FriendList from '@/components/FriendList';

const Friends = () => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      <FriendList></FriendList>
    </div>
  );
};

export default Friends;
