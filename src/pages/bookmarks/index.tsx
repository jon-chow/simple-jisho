import { useEffect, useState } from 'react';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

import Pagination from '@src/components/Pagination';

import Logo from "@src/assets/svg/Logo";

import styles from './BookmarksPage.module.scss';


// Enum for order by.
enum OrderBy {
  ASC = "ascending",
  DESC = "descending",
  NONE = "none",
}

// Enum for sort by.
enum SortBy {
  ALPHA = "alpha",
  DATE = "date",
	NONE = "none",
};

// Default component that is displayed when there are no bookmarks.
const Default = () => (
  <div className={styles.NoResults}>
    <Logo className={styles.Logo} />
    <h1>No terms were saved!</h1>
    <p>Try searching for a word and saving it!</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the bookmarks page.
 * 
 * The bookmarks page is a page that displays all the bookmarks that the user has saved.
 */
const BookmarksPage = () => {
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.NONE);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);

  // Fetch saved words from the local storage.
  useEffect(() => {
    let savedWords: string | null = localStorage.getItem('savedWords');

    if (savedWords != null) {
      switch (sortBy) {
        // Sort by alphabetical order.
        case SortBy.ALPHA:
          switch (orderBy) {
            // Sort by ascending alphabetical order.
            case OrderBy.ASC:
              savedWords = JSON.stringify(JSON.parse(savedWords).sort((a: any, b: any) => a.slug.localeCompare(b.slug, 'jp', { sensitivity: 'base' })));
              break;
            
            // Sort by descending alphabetical order.
            case OrderBy.DESC:
              savedWords = JSON.stringify(JSON.parse(savedWords).sort((a: any, b: any) => b.slug.localeCompare(a.slug, 'jp', { sensitivity: 'base' })));
              break;
            
            default:
              break;
          };
        
        // Sort by date.
        case SortBy.DATE:
          switch (orderBy) {
            // Sort by newest date.
            case OrderBy.ASC:
              savedWords = JSON.stringify(JSON.parse(savedWords).sort((a: any, b: any) => b.savedAt - a.savedAt));
              break;
            
            // Sort by oldest date.
            case OrderBy.DESC:
              savedWords = JSON.stringify(JSON.parse(savedWords).sort((a: any, b: any) => a.savedAt - b.savedAt));
              break;
            
            default:
              break;
          };
        
        // No sorting.
        default:
          break;
      };

      setSavedWords(JSON.parse(savedWords));
    };
  }, [orderBy, sortBy]);

  return (
    <div className={styles.BookmarksPage}>
      <div className={styles.Sorting}>
        <div className={styles.SortBy}>
          <label htmlFor="sort-by">Sort By:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value={SortBy.ALPHA}>Alphabetical</option>
            <option value={SortBy.DATE}>Date</option>
            <option value={SortBy.NONE}>None</option>
          </select>
          
          <button
            className={styles.SortOrder}
            onClick={() => {
              const sortOrderIndex = Object.values(OrderBy).indexOf(orderBy) + 1;
              const sortOrder = Object.values(OrderBy)[sortOrderIndex % Object.values(OrderBy).length];
              setOrderBy(sortOrder as OrderBy);
            }}
          >
            {orderBy === OrderBy.ASC && <FaSortUp />}
            {orderBy === OrderBy.DESC && <FaSortDown />}
            {orderBy === OrderBy.NONE && <FaSort />}
          </button>
        </div>
      </div>

      <Pagination
        results={savedWords}
        condition={savedWords.length > 0}
        default={<Default />}
      />
    </div>
  );
};

export default BookmarksPage;
