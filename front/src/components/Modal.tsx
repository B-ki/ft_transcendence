/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCallback, useEffect } from 'react';
import { FC } from 'react';

import crossIcon from '@/assets/cross.svg';
import { Button } from '@/components/Button';

interface ModalProps {
  show: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
}

//Need the calling function to send a setShow(false) to onClose function

export const Modal: FC<ModalProps> = ({ show, title, children, onClose }) => {
  if (!show) {
    return;
  }

  return (
    <div
      className="absolute left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-2 bg-dark-1/50"
      onClick={onClose}
      role="button"
      tabIndex={0}
    >
      <div
        className="flex flex-col items-center justify-center rounded-md bg-white-1 p-4"
        onClick={(e) => e.stopPropagation()}
        role="button"
        tabIndex={0}
      >
        <div className="flex w-full items-end justify-end">
          <Button onClick={onClose} size="xsmall" iconLeft={crossIcon} type="secondary"></Button>
        </div>
        <div>
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="">
          <span>{children}</span>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};
