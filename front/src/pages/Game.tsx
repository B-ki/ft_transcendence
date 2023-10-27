import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import background from '@/assets/layeredWavesBg.svg';

function Game() {
  const { user } = useAuth();

  return (
    <div
      className="relative flex h-screen w-screen flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Navbar />
      <div className="mt-10 flex w-screen justify-center gap-8">
        <h1>Game page</h1>
        <button className="w-fit">Login</button>
        {user && <button className="w-fit">Logout</button>}
      </div>
    </div>
  );
}

export default Game;
