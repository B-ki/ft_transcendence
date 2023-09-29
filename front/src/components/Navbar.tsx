import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './Button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
    <div className="relative flex w-screen flex-row justify-between bg-dark-3 px-8 py-2">
      {/* try with map */}
      <ul className="flex list-none flex-row items-center gap-8">
        <li>
          <NavLink to={'/home'}>Home</NavLink>
        </li>
        <li>
          <NavLink to={'/private'}>Private</NavLink>
        </li>
        <li>
          <NavLink to={'/profile'}>Profile</NavLink>
        </li>
        <li>
          <NavLink to={'/friends'}>Friends</NavLink>
        </li>
      </ul>
      <div className="flex items-end justify-end ">
        <Button size="small" type="primary" onClick={() => handleClick()}>
          logout
        </Button>
      </div>
    </div>
  );
};
