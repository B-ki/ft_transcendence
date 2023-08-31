import { FC } from 'react';

interface IconProps {
  size?: 'small' | 'large';
  logo: string;
}

const variants = {
  small: 'w-6',
  large: 'w-10',
};

export const Icon: FC<IconProps> = ({ size, logo }) => {
  return <img src={logo} className={`${size ? variants[size] : variants.small}`} alt="logo" />;
};
