import { FC } from 'react';

import { Icon } from '@/components/Icon';

interface ButtonProps {
  children?: React.ReactNode;
  type: 'primary' | 'secondary';
  size: 'xsmall' | 'small' | 'large' | 'xlarge';
  iconLeft?: string;
  iconRight?: string;
  onClick?: () => void;
}

const variants = {
  primary: 'bg-white-1 text-darkBlue-2 hover:bg-white-3',
  secondary: 'bg-accent text-dark-1 hover:bg-dark-3',

  xsmall: 'text-sm p-1',
  small: 'text-md px-4 py-2',
  large: 'text-xl px-4 py-2',
  xlarge: 'text-7xl p-5',
};

export const Button: FC<ButtonProps> = ({ children, type, iconLeft, iconRight, size, onClick }) => {
  return (
    <>
      <button className="" onClick={onClick}>
        <div
          className={`${type ? variants[type] : 'bg-white-1 text-primary hover:bg-white-3'} ${
            size ? variants[size] : ''
          }  flex items-center justify-center gap-3 rounded-md font-bold drop-shadow-lg`}
        >
          {iconLeft && <Icon size={size} logo={iconLeft} />}
          {children ? <span>{children}</span> : null}
          {iconRight && <Icon size={size} logo={iconRight} />}
        </div>
      </button>
    </>
  );
};
