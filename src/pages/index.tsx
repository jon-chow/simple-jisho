import { useState } from 'react';

import { Status, ResultsContext, SearchContext, SearchHistoryContext, KanjiContext } from '../configs/config';

import MetaData from '../components/MetaData';
import Background from '../components/Background';
import TopBar from '../components/TopBar';
import Pagination from '../components/Pagination';
import DefaultResults from '../components/DefaultResults';
import Footer from '../components/Footer';

import styles from '../styles/Home.module.scss';
import SearchHistoryModal from '../components/SearchHistoryModal';
import KanjiModal from '../components/KanjiModal';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the Home component.
 * 
 * The Home component is basically the entire page.
 */
const Home = () => {
  const [currentSearch, setQuery] = useState("");
  const [searchStatus, setStatus] = useState<Status>(Status.IDLE);

  const [resultKeyword, setKeyword] = useState("");
  const [results, setResults] = useState<WordData[]>([]);

  const [historyModalToggle, setHistoryModalToggle] = useState(false);

  const [kanji, setKanji] = useState<string[]>([]);
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
                { (results.length > 0 && searchStatus === Status.SUCCESS) ?
                  <Pagination results={results} /> : <DefaultResults /> }
              </main>

              <Footer />
            </div>
          </KanjiContext.Provider>
        </SearchHistoryContext.Provider>
      </ResultsContext.Provider>
    </SearchContext.Provider>
  );
};

export default Home;
