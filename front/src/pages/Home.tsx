import background from '@/assets/layeredWavesBg.svg';
import { Navbar } from '@/components/Navbar';

function Home() {
<<<<<<< HEAD
=======
  const { user, login, logout } = useAuth();

  // Not working anymore
  // const { data, isLoading } = useApi().get('Get Me info', '/user');

  // if (isLoading) return <div>Loading...</div>;
  // console.log(data);

>>>>>>> main
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
        <div className="absolute flex h-2/3 w-screen flex-col justify-center gap-6">
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
