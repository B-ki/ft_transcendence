import { useState } from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Private', href: '/private' },
  { name: 'Profile', href: '/profile' },
  { name: 'Friends', href: '/friends' },
];

export const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handlClick = () => {
    setOpen(!open);
  };

  const handleMenuOne = () => {
    navigate('/home');
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handlClick}>Dropdown</Button>
      {open ? (
        <ul className="absolute m-1 list-none border border-dark-1">
          <li className=" w-20 bg-grey hover:bg-darkBlue-1">
            <button className="w-full">Menu 1</button>
          </li>
          <li className=" w-20 bg-grey hover:bg-darkBlue-1">
            <button className="w-full">Menu 2</button>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
