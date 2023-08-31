import React, { useState } from 'react';
import { FC } from 'react';

interface InputProps {
  text: string;
}

export const Input: FC<InputProps> = ({ text }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <input
          className="rounded-md border border-dark-3 hover:border-blue focus:outline-none"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={text}
        />
      </div>
    </div>
  );
};
