import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BsFillTrashFill, BsSearch } from 'react-icons/bs';

import { setLocalStorage } from '@/utils/setLocalStorage'; 

import { useSearch, Status } from '@/contexts/SearchProvider';
import { useResults } from '@/contexts/ResultsProvider';
import { useModal, resetModalContext } from '@/contexts/ModalProvider';

import ModalLayout from '../ModalLayout/ModalLayout';

import styles from './SearchHistoryModal.module.scss';
import styles2 from '../../SearchBar/SearchBar.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the search history modal component.
 * 
 * The search history modal displays a list of past search terms.
 */
const SearchHistoryModal = () => {
  const [numSearches, setNumSearches] = useState(0);

  const searchContext = useSearch();
  const resultsContext = useResults();
  const searchHistoryContext = useModal();

  const router = useRouter();

  // Handle number of searches changes.
  const handleNumSearchesChange = () => {
    const searchHistory = localStorage.getItem("searchHistory");

    if (searchHistory) {
      const history = JSON.parse(searchHistory) as SearchHistory[];
      setNumSearches(history.length);
    };
  };

  // Update number of searches from event listeners.
  useEffect(() => {
    handleNumSearchesChange();

    window.addEventListener("storage_searchHistory", handleNumSearchesChange);
    return () => window.removeEventListener("storage_searchHistory", handleNumSearchesChange);
  }, []);
    

  return (
    <ModalLayout title={`Search History (${numSearches} Item${numSearches === 1 ? '' : 's' })`} width="50vw" height="80vh">
      <div className={styles.HistoryContainer}>
        { localStorage.getItem("searchHistory") &&
          JSON.parse(localStorage.getItem("searchHistory") as string).map((searchItem : SearchHistory, index : number) => (
          <div key={index} className={styles.HistoryItem}>
            <p>&quot;{searchItem.keyword}&quot;</p>
            <p>{(new Date(searchItem.date)).toLocaleString()}</p>

            <div className={styles.HistoryItemControls}>
              <button
                title="Search History Item"
                onClick={() => {
                  let query = searchItem.keyword;
                  searchContext.setQuery(query);
                  searchContext.setStatus(Status.SUCCESS);
                  resultsContext.setKeyword(query);
                  resultsContext.setResults(searchItem.results);
                  router.push({ pathname: "/search", query: { q: query } }, undefined, { shallow: true });

                  const input = document.querySelector(`.${styles2.SearchInput}`) as HTMLInputElement;
                  input.value = searchItem.keyword;

                  resetModalContext(searchHistoryContext);
                }}
              >
                <BsSearch />
              </button>
              <button
                title="Delete History Item"
                onClick={(e) => {
                  const searchHistory = localStorage.getItem("searchHistory");
                  
                  if (searchHistory) {
                    const history = JSON.parse(searchHistory) as SearchHistory[];
                    const index = history.findIndex((item) => item.keyword === searchItem.keyword);

                    if (index !== -1) {
                      history.splice(index, 1);
                    };

                    setLocalStorage("searchHistory", history);
                  };
                }}
              >
                <BsFillTrashFill />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.ModalClearHistoryButton}
        onClick={() => {
          const historyItems = localStorage.getItem("searchHistory");
          
          if (historyItems) {
            const history = JSON.parse(historyItems) as SearchHistory[];
            if (confirm(`Are you sure you want to clear your search history? (${history.length} item${history.length !== 1 ? "s" : ""})`))
              setLocalStorage("searchHistory", []);
          };
        }}
      >
        Clear History
      </button>
    </ModalLayout>
  );
};

export default SearchHistoryModal;
