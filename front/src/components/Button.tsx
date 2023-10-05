import { FC } from 'react';

import { Icon } from '@/components/Icon';

interface ButtonProps {
  children?: React.ReactNode;
  type?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  iconLeft?: string;
  iconRight?: string;
  onClick?: () => void;
}

const variants = {
  primary: 'bg-white-1 text-primary hover:bg-white-3',
  secondary: 'bg-accent text-dark-1 hover:bg-dark-3',

  small: 'text-md',
  large: 'text-xl',
};

export const Button: FC<ButtonProps> = ({ children, type, iconLeft, iconRight, size, onClick }) => {
  return (
    <>
      <button className="" onClick={onClick}>
        <div
          className={`${type ? variants[type] : 'bg-white-1 text-primary hover:bg-white-3'} ${
            size ? variants[size] : ''
          }  flex items-center justify-center gap-3 rounded-md px-4 py-2 font-bold drop-shadow-lg`}
        >
          {iconLeft && <Icon size={size} logo={iconLeft} />}
          {children ? <span>{children}</span> : null}
          {iconRight && <Icon size={size} logo={iconRight} />}
        </div>
      </button>
    </>
  );
};
