import React, { useState, FormEvent, ChangeEvent } from 'react';
import PicUploader from './PicUploader';
import { UseQueryResult, useMutation } from 'react-query';
import { api } from '@/utils/api';

const inputs = [
  {
    key: '0',
    id: 'usernameInput',
    labelTxt: 'Username',
    inputTxt: 'Enter your username...',
    mandatory: true,
  },
  {
    key: '1',
    id: 'descriptionInput',
    labelTxt: 'Description',
    inputTxt: '30 character maximum',
    mandatory: false,
  },
];

function Form() {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  const mutation = useMutation({
    mutationFn: (userInfos) => {
      return api.patch('user/me', { json: userInfos });
    },
  });

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({ displayName: 'test' });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 border">
      <h2>Edit your profile</h2>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <PicUploader ID="profilePic" name="Profile picture"></PicUploader>
          <label className="flex flex-col">
            Username
            <input
              className="rounded-md border border-dark-3 bg-white-3 p-1  invalid:border-red focus:border-blue focus:outline-none"
              key="0"
              id="usernameInput"
              placeholder="Enter your username..."
              type="text"
              maxLength={30}
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <label className="flex flex-col">
            Description
            <input
              className="rounded-md border border-dark-3 bg-white-3 p-1  invalid:border-red focus:border-blue focus:outline-none"
              key="1"
              id="descriptionInput"
              placeholder="30 character maximum"
              type="text"
              maxLength={30}
              value={description}
              onChange={handleDescriptionChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Form;
