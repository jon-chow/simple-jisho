import type { AppProps } from 'next/app';

import ThemeContextProvider from '@/contexts/ThemeProvider';
import SearchContextProvider from '@/contexts/SearchProvider';
import ResultsContextProvider from '@/contexts/ResultsProvider';
import NotificationsContextProvider from '@/contexts/NotificationsProvider';
import ModalContextProvider from '@/contexts/ModalProvider';

import MetaData from '@/components/MetaData';
import Background from '@/components/Background/Background';
import TopBar from '@/components/TopBar/TopBar';
import Footer from '@/components/Footer/Footer';

import '@/styles/_globals.scss';
import styles from '@/styles/Layout.module.scss';


/**
 * Creates the Layout component.
 * 
 * The Layout component is the default page layout. 
 */
const Layout = ({ children }: any) => {
  return (
    <ThemeContextProvider>
      <SearchContextProvider>
        <ResultsContextProvider>
          <NotificationsContextProvider>
            <ModalContextProvider>
              <div className={styles.Container}>
                <MetaData />
                <Background />
                <TopBar />

                <main className={styles.Main}>
                  { children }
                </main>

                <Footer />
              </div>
            </ModalContextProvider>
          </NotificationsContextProvider>
        </ResultsContextProvider>
      </SearchContextProvider>
    </ThemeContextProvider>
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the App component.
 * 
 * The App component is exactly what it is...
 */
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
