import React, { useState, FormEvent, ChangeEvent, SyntheticEvent } from 'react';
import PicUploader from './PicUploader';
import { UseQueryResult, useMutation } from 'react-query';
import { api } from '@/utils/api';
import { useApi } from '@/hooks/useApi';
import { userDto } from '@/dto/userDto';

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
  const [file, setFile] = useState<FileList | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const mutation = useMutation({
    mutationFn: (userInfos) => {
      return api.patch('/user/me', { json: userInfos });
    },
  });

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files);
      const imageUrl = URL.createObjectURL(files[0]);
      setImageUrl(imageUrl);
    }
  };

  const {
    data: user,
    isLoading,
    isError,
  } = useApi().get('get user profile', '/user/me') as UseQueryResult<userDto>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event.currentTarget.elements.usernameInput.value);
    if (
      event.currentTarget.elements.usernameInput.value &&
      event.currentTarget.elements.descriptionInput.value
    )
      mutation.mutate({
        displayName: event.currentTarget.elements.usernameInput.value,
        description: event.currentTarget.elements.descriptionInput.value,
      });
    else if (event.currentTarget.elements.usernameInput.value) {
      mutation.mutate({
        displayName: event.currentTarget.elements.usernameInput.value,
      });
    } else if (event.currentTarget.elements.descriptionInput.value) {
      mutation.mutate({
        description: event.currentTarget.elements.descriptionInput.value,
      });
    } else {
      console.log(console.log(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 border">
      <h2>Edit your profile</h2>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex">
            <div className="flex flex-col items-center justify-center">
              <input type="file" onChange={handleFileChange} />
              <img style={{ maxWidth: '100px' }} src={imageUrl} alt="Profile Picture" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <input type="file" onChange={handleFileChange} />
              <img style={{ maxWidth: '100px' }} src={imageUrl} alt="Profile Picture" />
            </div>
          </div>
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
