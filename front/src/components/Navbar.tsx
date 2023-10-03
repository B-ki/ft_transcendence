import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';
import gitLogo from '@/assets/github-mark.svg';

const navigation = [
  { name: 'home', href: '/home' },
  { name: 'Private', href: '/private' },
  { name: 'Profile', href: '/profile' },
  { name: 'Friends', href: '/friends' },
];

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-around bg-darkBlue-2 p-2">
      <div>
        <a href="https://github.com/B-ki/ft_transcendence" className="flex gap-3">
          <img src={gitLogo} alt="link to our github" className="h-9" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold">Our Pong</span>
        </a>
      </div>
      <div className="p-2x space-x-4 p-2">
        {/* try with map */}
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => {
              return (
                'rounded-md px-3 py-2 text-sm font-medium no-underline' +
                (!isActive
                  ? 'text-dark-1 hover:bg-darkBlue-1 hover:text-dark-1'
                  : ' bg-darkBlue-3 text-white-1')
              );
            }}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="flex items-center justify-end ">
        <Button size="small" type="primary" onClick={() => handleClick()}>
          logout
        </Button>
      </div>
    </div>
  );
};
