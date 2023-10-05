import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import gitLogo from '@/assets/github-mark.svg';
import { useAuth } from '@/hooks/useAuth';

import { Button } from './Button';
import { Dropdown } from './Dropdown';

const navigation = [
  { name: 'Game', href: '/game' },
  { name: 'Profile', href: '/profile' },
  { name: 'Friends', href: '/friends' },
];

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <div className="flex h-16 items-center justify-between bg-darkBlue-2 px-10 py-2">
      <div className="flex flex-row">
        <button onClick={handleLogoClick} className="flex gap-3">
          <img src={gitLogo} alt="link to our github" className="h-9" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-white-3">
            Our Pong
          </span>
        </button>
        <div className="hidden space-x-4 px-2 py-1 sm:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => {
                return (
                  'text-md rounded-md px-3 py-2 font-medium no-underline' +
                  (!isActive
                    ? ' text-white-3 hover:bg-accent hover:text-white-1'
                    : ' bg-darkBlue-3 text-white-1')
                );
              }}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="hidden items-center justify-end sm:flex ">
        <Button size="small" type="primary" onClick={() => handleLogoutClick()}>
          logout
        </Button>
      </div>
      <div className="flex sm:hidden">
        <Dropdown></Dropdown>
      </div>
    </div>
  );
};
