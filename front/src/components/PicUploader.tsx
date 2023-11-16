import { userDto } from '@/dto/userDto';
import React, { SetStateAction, useCallback, useState } from 'react';
import { FC } from 'react';
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface InputProps {
  ID: string;
  name: 'Profile picture' | 'Banner';
  user: userDto | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const PicUploader: FC<InputProps> = ({ ID, name, user, setFile }) => {
  const [image, setImage] = useState<string | null | undefined>(null);
  let data: string | undefined;

  if (name === 'Profile picture' && user?.imagePath) {
    data = user?.imagePath;
  } else if (name === 'Profile picture' && !user?.imagePath) {
    data = user?.intraImageURL;
  } else {
    data = user?.bannerPath;
  }

  useEffect(() => {
    setImage(data);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(acceptedFiles[0]);

    // Here, you can handle the file, for example, upload it to a server
    // For simplicity, we'll just update the state with the selected image.
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImage(result);
      } else {
        setImage(data);
      }
    };
    reader.readAsDataURL(file);
    console.log(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ cursor: 'pointer' }}>
        <input id={ID} accept=".jpg, .jpeg, .png" type="file" {...getInputProps()} />
        {image ? (
          <div className="flex flex-col items-center">
            <span>{name}</span>
            <img style={{ maxHeight: '100px' }} src={image} alt={`${name} couldn't be displayed`} />
          </div>
        ) : (
          <div style={{ maxWidth: '100px' }}>Click to upload a {name}</div>
        )}
      </div>
    </div>
  );
};

export default PicUploader;
