import { useRouter } from 'next/router';
import { useUser } from '../components/UserContext';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUser();
  const isLoggedIn = userInfo !== null;
  const [showFooter, setShowFooter] = useState(false);

  const navigateHome = () => {
    router.push('/');
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/logout',
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUserInfo(null);
        router.push('/?status=loggedOut');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !showFooter
      ) {
        setShowFooter(true);
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showFooter]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={navigateHome}>
            Space Wars
          </h1>
          <div className="flex space-x-4">
            <button onClick={() => router.push('/gamePage')} className="mx-2">Play</button>
            <button onClick={() => router.push('/accountPage')} className="mx-2">Account</button>
            <button onClick={() => router.push('/leaderboardPage')} className="mx-2">Leaderboard</button>
            <button onClick={() => router.push('/storePage')} className="mx-2">Store</button>
            {isLoggedIn && <button onClick={logout} className="mx-2">Logout</button>}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 fixed bottom-0 w-full">
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



