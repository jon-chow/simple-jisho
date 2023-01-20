import type { AppProps } from 'next/app';
import { useState } from 'react';

import { Status, ResultsContext, SearchContext, ModalContext, ModalType } from '../configs/config';

import MetaData from '../components/MetaData';
import Background from '../components/Background';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

import DevLogsModal from '../components/modals/DevLogsModal';
import SearchHistoryModal from '../components/modals/SearchHistoryModal';
import KanjiModal from '../components/modals/KanjiModal';
import KanaModal from '../components/modals/KanaModal';

import '../styles/_globals.scss';
import styles from '../styles/Layout.module.scss';


/**
 * Returns the modal component to be displayed.
 * 
 * @param modalType the type of modal to display.
 * @param modalToggle whether or not to display the modal.
 * @returns the modal to display.
 */
const getModal = (modalType: ModalType, modalToggle: boolean) => {
  if (!modalToggle) return null;

  switch (modalType) {
    case ModalType.DEVLOGS:        return <DevLogsModal />;
    case ModalType.SEARCH_HISTORY: return <SearchHistoryModal />;
    case ModalType.KANJI:          return <KanjiModal />;
    case ModalType.KANA:           return <KanaModal />;
    default:                       return null;
  }
};

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

  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [modalToggle, setModalToggle] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  return (
    <SearchContext.Provider value={{
      query: currentSearch, setQuery,
      status: searchStatus, setStatus
    }}>
      <ResultsContext.Provider value={{
        results: results, setResults,
        keyword: resultKeyword, setKeyword,
      }}>
        <ModalContext.Provider value={{
          modalType, setModalType,
          modalToggle, setModalToggle,
          data, setData
        }}>
          <div className={styles.Container}>
            <MetaData />
            <Background />
            <TopBar />

            {/* Modal */}
            { getModal(modalType, modalToggle) }

            {/* Main Content */}
            <main className={styles.Main}>
              { children }
            </main>

            <Footer />
          </div>
        </ModalContext.Provider>
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
