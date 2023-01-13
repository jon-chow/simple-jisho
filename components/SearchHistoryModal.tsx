import { useContext } from 'react';
import { BsX, BsFillTrashFill, BsSearch } from 'react-icons/bs';

import { SearchHistoryContext } from '../configs/config';

import styles from '../styles/SearchHistoryModal.module.scss';

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the search history modal component.
 * 
 * The search history modal displays a list of past search terms.
 */
const SearchHistoryModal = () => {
  const searchHistoryContext = useContext(SearchHistoryContext);

  // Toggle the search history modal.
  const toggleSearchHistoryModal = () => {
    searchHistoryContext.setModalToggle(!searchHistoryContext.modalToggle);
  };

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
              <p>{searchItem.date.toLocaleString()}</p>

              <div className={styles.HistoryItemControls}>
                <button
                  title="Search History Item"
                  // onClick={handleSearchHistoryItem(searchItem)}
                >
                  <BsSearch />
                </button>
                <button
                  title="Delete History Item"
                  // onClick={handleDeleteHistoryItem(searchItem)}
                >
                  <BsFillTrashFill />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.ModalClearHistoryButton}
          // onClick={handleClearHistory}
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default SearchHistoryModal;
