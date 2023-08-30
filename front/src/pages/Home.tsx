// import '@/styles/pages/Home.css';

import React, { useState } from 'react';

import logo from '@/assets/logo.svg';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

function Home() {
  const [count, setCount] = useState(0);
  const { user, login, logout } = useAuth();

  const { error, data, isLoading } = useApi().get('test', '/banks', {
    params: { test: 'bonjours' },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) console.log(error);
  if (data) console.log(data);

  return (
    <div className="App">
      <div className="mt-10 flex w-screen justify-center gap-8">
        <button className="w-fit" onClick={() => login('apigeon@42.fr', '1234')}>
          Login
        </button>
        {user && (
          <button className="w-fit" onClick={logout}>
            Logout
          </button>
        )}
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="header">
          🚀 Vite + React + Typescript 🤘 & <br />
          Eslint 🔥+ Prettier
        </p>

        <div className="body">
          <button onClick={() => setCount((count) => count + 1)}>🪂 Click me : {count}</button>

          <p> Don&apos;t forgot to install Eslint and Prettier in Your Vscode.</p>

          <p>
            Mess up the code in <code>App.tsx </code> and save the file.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default Home;
