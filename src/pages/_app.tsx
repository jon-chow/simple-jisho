import type { AppProps } from 'next/app';
import Script from 'next/script';

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
export const Layout = ({ children }: React.PropsWithChildren): JSX.Element => {
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
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default App;
