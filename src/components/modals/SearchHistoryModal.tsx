import { useRouter } from 'next/router';
import { BsFillTrashFill, BsSearch } from 'react-icons/bs';

import { useSearch, Status } from '../../contexts/SearchProvider';
import { useResults } from '../../contexts/ResultsProvider';
import { useModal, resetModalContext } from '../../contexts/ModalProvider';

import ModalLayout from './ModalLayout';

import styles from '../../styles/SearchHistoryModal.module.scss';
import styles2 from '../../styles/SearchBar.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the search history modal component.
 * 
 * The search history modal displays a list of past search terms.
 */
const SearchHistoryModal = () => {
  const searchContext = useSearch();
  const resultsContext = useResults();
  const searchHistoryContext = useModal();

  const router = useRouter();

  return (
    <ModalLayout title="Search History" width="50vw" height="80vh">
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
    </ModalLayout>
  );
};

export default SearchHistoryModal;
