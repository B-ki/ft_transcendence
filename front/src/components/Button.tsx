import { Icon } from '@/components/Icon';

interface ButtonProps {
  children?: React.ReactNode;
  type?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  iconLeft?: string;
  iconRight?: string;
}

const variants = {
  primary: 'bg-white-1 text-primary hover:bg-white-3',
  secondary: 'bg-accent text-dark-1 hover:bg-dark-3',

  small: 'text-md',
  large: 'text-xl',
};

export const Button = (props: ButtonProps) => {
  const { children, type, iconLeft, iconRight, size } = props;

  return (
    <div>
      <button>
        <div
          className={`${type ? variants[type] : ''} ${
            size ? variants[size] : ''
          }  flex items-center justify-center gap-3 rounded-md px-4 py-2 font-bold drop-shadow-lg`}
        >
          {iconLeft && <Icon size={props.size} logo={iconLeft} />}
          <span>{children}</span>
          {iconRight && <Icon size={props.size} logo={iconRight} />}
        </div>
      </button>
    </div>
  );
};
