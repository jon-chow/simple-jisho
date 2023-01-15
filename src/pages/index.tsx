import { useState } from 'react';

import { Status, ResultsContext, SearchContext, SearchHistoryContext } from '../configs/config';

import MetaData from '../components/MetaData';
import Background from '../components/Background';
import TopBar from '../components/TopBar';
import Pagination from '../components/Pagination';
import DefaultResults from '../components/DefaultResults';
import Footer from '../components/Footer';

import styles from '../styles/Home.module.scss';
import SearchHistoryModal from '../components/SearchHistoryModal';


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

  const [modalToggle, setModalToggle] = useState(false);

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
          modalToggle: modalToggle, setModalToggle
        }}>
          <div className={styles.Container}>
            <MetaData />
            <Background />
            <TopBar />

            {/* Search History Modal */}
            { modalToggle && <SearchHistoryModal /> }

            {/* Main Content */}
            <main className={styles.Main}>
              { (results.length > 0 && searchStatus === Status.SUCCESS) ?
                <Pagination results={results} /> : <DefaultResults /> }
            </main>

            <Footer />
          </div>
        </SearchHistoryContext.Provider>
      </ResultsContext.Provider>
    </SearchContext.Provider>
  );
};

export default Home;
