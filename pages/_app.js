import Layout from '../components/layout';
import '../styles/tailwind.css';
import { UserProvider } from '../components/UserContext';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;