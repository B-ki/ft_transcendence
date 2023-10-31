import background from '@/assets/layeredWavesBg.svg';
import { Button } from '@/components/Button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

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
      <div className="mt-10 flex h-2/3 w-screen items-center justify-center gap-8">
        <Button type="primary" size="xlarge">
          Game
        </Button>
      </div>
    </div>
  );
}

export default Game;
