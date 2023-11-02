import background from '@/assets/layeredWavesBg.svg';
import { Navbar } from '@/components/Navbar';

function Home() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Navbar />
      <div className="h-screen w-screen">
        <div className="flex h-2/3 w-screen flex-col justify-center gap-6">
          <p className="flex items-center justify-center text-6xl font-bold text-white-1">
            Welcome to
          </p>
          <p className="flex items-center justify-center text-6xl font-bold text-white-1">
            Our Pong
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
