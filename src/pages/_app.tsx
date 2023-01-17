import type { AppProps } from 'next/app';
import { useState } from 'react';

import { Status, ResultsContext, SearchContext, SearchHistoryContext, KanjiContext } from '../configs/config';

import MetaData from '../components/MetaData';
import Background from '../components/Background';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import SearchHistoryModal from '../components/SearchHistoryModal';
import KanjiModal from '../components/KanjiModal';

import '../styles/_globals.scss';
import styles from '../styles/Layout.module.scss';


/**
 * Exports the Layout component.
 * 
 * The Layout component is the default page layout. 
 */
const Layout = ({ children }: any) => {
  const [currentSearch, setQuery] = useState("");
  const [searchStatus, setStatus] = useState<Status>(Status.IDLE);

  const [resultKeyword, setKeyword] = useState("");
  const [results, setResults] = useState<WordData[]>([]);

  const [historyModalToggle, setHistoryModalToggle] = useState(false);

  const [kanji, setKanji] = useState<any[]>([]);
  const [kanjiModalToggle, setKanjiModalToggle] = useState(false);

  return (
    <SearchContext.Provider value={{
      query: currentSearch, setQuery,
      status: searchStatus, setStatus
    }}>
      <ResultsContext.Provider value={{
        results: results, setResults,
        keyword: resultKeyword, setKeyword
      }}>
        <SearchHistoryContext.Provider value={{
          modalToggle: historyModalToggle, setModalToggle: setHistoryModalToggle
        }}>
          <KanjiContext.Provider value={{
            modalToggle: kanjiModalToggle, setModalToggle: setKanjiModalToggle,
            kanji: kanji, setKanji
          }}>
            <div className={styles.Container}>
              <MetaData />
              <Background />
              <TopBar />

              {/* Search History Modal */}
              { historyModalToggle && <SearchHistoryModal /> }

              {/* Kanji Modal */}
              { kanjiModalToggle && <KanjiModal /> }

              {/* Main Content */}
              <main className={styles.Main}>
                { children }
              </main>

              <Footer />
            </div>
          </KanjiContext.Provider>
        </SearchHistoryContext.Provider>
      </ResultsContext.Provider>
    </SearchContext.Provider>
  );
};

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
