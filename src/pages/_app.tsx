import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { GoogleAnalytics } from 'nextjs-google-analytics';

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


/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates the Layout component. \
 * The Layout component is the default page layout.
 * @param children The children of the Layout component.
 * @returns The Layout component.
 */
const Layout = ({ children }: React.PropsWithChildren): JSX.Element => {
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
 * Exports the App component. \
 * The App component is exactly what it is...
 * @param Component The component to render.
 * @param pageProps The props of the component.
 * @returns The app component.
 */
const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  return (
    <>
      <GoogleAnalytics
        gtagUrl="/js/ga-stat.js"
        strategy="lazyOnload"
        trackPageViews
      />
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default App;
