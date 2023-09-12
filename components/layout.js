import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();


  const navigateHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={navigateHome}>
            Space Wars
          </h1>
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


