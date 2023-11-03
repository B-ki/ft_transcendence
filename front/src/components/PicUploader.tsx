import React, { useCallback, useState } from 'react';
import { FC } from 'react';
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface InputProps {
  picture?: string | null;
  name: 'Profile picture' | 'Banner';
  ID: string;
}

const PicUploader: FC<InputProps> = ({ ID, picture, name }) => {
  const [image, setImage] = useState<string | null | undefined>(null);

  useEffect(() => {
    setImage(picture);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    // Here, you can handle the file, for example, upload it to a server
    // For simplicity, we'll just update the state with the selected image.
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImage(result);
      } else {
        setImage(null);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ cursor: 'pointer' }}>
        <input id={ID} {...getInputProps()} />
        {image ? (
          <div className="flex flex-col items-center">
            <span>{name}</span>
            <img style={{ maxHeight: '100px' }} src={image} alt={name} />
          </div>
        ) : (
          <div style={{ maxWidth: '100px' }}>Click to upload a {name}</div>
        )}
      </div>
    </div>
  );
};

export default PicUploader;
