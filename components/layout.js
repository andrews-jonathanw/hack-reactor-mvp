import { useRouter } from 'next/router';
import { useUser } from '../components/UserContext';
import axios from 'axios';
export default function Layout({ children }) {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUser();
  const isLoggedIn = userInfo !== null;

  const navigateHome = () => {
    router.push('/');
  };

  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/logout', {}, {
        withCredentials: true
      });
      if (response.status === 200) {
        setUserInfo(null);
        router.push('/?status=loggedOut');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
};

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={navigateHome}>
            Space Wars
          </h1>
          <div className="flex space-x-4">
            <button onClick={() => router.push('/account')} className="mx-2">Account</button>
            <button onClick={() => router.push('/leaderboard')} className="mx-2">Leaderboard</button>
            <button onClick={() => router.push('/store')} className="mx-2">Store</button>
            {isLoggedIn && <button onClick={logout} className="mx-2">Logout</button>}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; 2023 Space Wars. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="https://github.com/andrews-jonathanw/hack-reactor-mvp" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              GitHub
            </a>
            <a href="/about" className="hover:text-blue-400">
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}



