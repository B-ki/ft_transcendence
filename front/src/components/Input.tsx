import React, { useState } from 'react';
import { FC } from 'react';

interface InputProps {
  labelText: string;
  inputText: string;
  mandatory: boolean;
}

export const Input: FC<InputProps> = ({ labelText, inputText, mandatory }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <label className="flex flex-col">
      <span className={`${mandatory ? "after:text-red after:content-['*'] " : ''} text-dark-2`}>
        {labelText}
      </span>
      <input
        className="rounded-md border border-dark-3 bg-white-3  invalid:border-red focus:border-blue focus:outline-none"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={inputText}
      />
    </label>
  );
};
