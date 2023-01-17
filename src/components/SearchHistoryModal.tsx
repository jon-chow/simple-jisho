import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BsX, BsFillTrashFill, BsSearch } from 'react-icons/bs';

import { Status, SearchHistoryContext, ResultsContext, SearchContext } from '../configs/config';

import styles from '../styles/SearchHistoryModal.module.scss';
import styles2 from '../styles/SearchBar.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the search history modal component.
 * 
 * The search history modal displays a list of past search terms.
 */
const SearchHistoryModal = () => {
  const searchContext = useContext(SearchContext);
  const searchHistoryContext = useContext(SearchHistoryContext);
  const resultsContext = useContext(ResultsContext);

  const router = useRouter();

  // Toggle the search history modal.
  const toggleSearchHistoryModal = () => {
    searchHistoryContext.setModalToggle(!searchHistoryContext.modalToggle);
  };

  // Close the search history modal when the user clicks outside of it.
  useEffect(() => {
    const modal = document.querySelector(`.${styles.ModalContainer}`) as HTMLDivElement;

    const handleClickOutside = (e : MouseEvent) => {
      if (modal && !modal.contains(e.target as Node)) {
        toggleSearchHistoryModal();
      };
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.SearchHistoryModal}>
      <div className={styles.ModalContainer}>
        <div className={styles.ModalHeader}>
          <button
            className={styles.ModalCloseButton}
            onClick={toggleSearchHistoryModal}
          >
            <BsX />
          </button>

          <h1 className={styles.ModalTitle}>Search History</h1>
        </div>

        <div className={styles.HistoryItems}>
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

                    toggleSearchHistoryModal();
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

                      localStorage.setItem("searchHistory", JSON.stringify(history));
                      e.currentTarget.parentElement?.parentElement?.remove();
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
            const historyItems = document.querySelectorAll(`.${styles.HistoryItem}`);
            
            if (historyItems.length !== 0) {
              if (confirm("Are you sure you want to clear your search history? " +
                `(${historyItems.length} search item${historyItems.length !== 1 ? "s" : ""})`)) {
                localStorage.setItem("searchHistory", JSON.stringify([]));
                historyItems.forEach((item) => item.remove());
              };
            };
          }}
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default SearchHistoryModal;
