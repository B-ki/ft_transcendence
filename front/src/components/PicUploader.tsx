import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FC } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

interface InputProps {
  picture?: string | null;
  name: 'Profile picture' | 'Banner';
}

const PicUploader: FC<InputProps> = ({ picture, name }) => {
  const [image, setImage] = useState<string | null | undefined>(null);
  const { user } = useAuth();

  useEffect(() => {
    setImage(picture);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Assuming only one file is uploaded

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
        <input {...getInputProps()} />
        {image ? (
          <div className="flex flex-col items-center">
            <span>{name}</span>
            <img style={{ maxHeight: '100px' }} src={image} alt="Profile Picture" />
          </div>
        ) : (
          <div style={{ maxWidth: '100px' }}>Click to upload a {name}</div>
        )}
      </div>
    </div>
  );
};

export default PicUploader;
