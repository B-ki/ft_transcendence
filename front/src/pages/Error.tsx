import React from 'react';
import { useRouteError } from 'react-router-dom';

interface ErrorProps {
  statusText: string;
  message: string;
}

function Error() {
  const error = useRouteError() as ErrorProps;
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center pb-60">
      <h1 className="text-3xl">Oops!</h1>
      <p>Sorry, an unexpected error has occured.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default Error;
