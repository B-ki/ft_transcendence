import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DropdownImg from '@/assets/dropdown.svg';
import { useAuth } from '@/hooks/useAuth';

import { Button } from './Button';

const navigation = [
  { id: '0', name: 'Game', href: '/game' },
  { id: '1', name: 'Profile', href: '/profile' },
  { id: '2', name: 'Friends', href: '/friends' },
];

export const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handlDropdownClick = () => {
    setOpen(!open);
  };

  const handleMenuClick = (item: { name: string; href: string }) => {
    navigate(item.href);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <Button
        type="primary"
        size="small"
        iconLeft={DropdownImg}
        onClick={handlDropdownClick}
      ></Button>
      {open ? (
        <ul className="absolute m-1 list-none rounded-md border border-dark-1 bg-darkBlue-2 text-white-1">
          {navigation.map((item) => (
            <li key={item.id} className=" w-20 rounded-md hover:bg-accent">
              <button className="w-full" onClick={() => handleMenuClick(item)}>
                {item.name}
              </button>
            </li>
          ))}
          <div>
            <li className=" w-20 rounded-b-md border-t border-t-dark-1 hover:bg-accent">
              <button onClick={handleLogout} className="w-full">
                Logout
              </button>
            </li>
          </div>
        </ul>
      ) : null}
    </div>
  );
};
