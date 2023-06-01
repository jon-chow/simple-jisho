import type { AppProps } from 'next/app';

import SettingsContextProvider from '@src/contexts/SettingsProvider';
import SearchContextProvider from '@src/contexts/SearchProvider';
import ResultsContextProvider from '@src/contexts/ResultsProvider';
import NotificationsContextProvider from '@src/contexts/NotificationsProvider';
import ModalContextProvider from '@src/contexts/ModalProvider';

import MetaData from '@src/components/MetaData';
import Background from '@src/components/Background';
import TopBar from '@src/components/TopBar';
import Footer from '@src/components/Footer';

import '@src/styles/_globals.scss';
import styles from '@src/styles/Layout.module.scss';


/**
 * Creates the Layout component.
 * 
 * The Layout component is the default page layout. 
 */
const Layout = ({ children }: any) => {
  return (
    <SettingsContextProvider>
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
    </SettingsContextProvider>
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
