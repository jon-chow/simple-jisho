import { useEffect, useState } from 'react';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

import Pagination from '@src/components/Pagination';

import Logo from "@src/assets/svg/Logo";

import styles from './BookmarksPage.module.scss';


/**
 * Enum for order by.
 */
enum OrderBy {
  ASC = "ascending",
  DESC = "descending",
  NONE = "none",
};

/**
 * Enum for sort by.
 */
enum SortBy {
  ALPHA = "alpha",
  DATE = "date",
	NONE = "none",
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Default component that is displayed when there are no bookmarks.
 * @returns The default component.
 */
const Default = (): JSX.Element => (
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
 * Exports the bookmarks page. \
 * The bookmarks page is a page that displays all the bookmarks that the user has saved.
 * @returns The bookmarks page component.
 */
const BookmarksPage = (): JSX.Element => {
  const [savedWords, setSavedWords] = useState<Object[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.NONE);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.ALPHA);

  // Fetch saved words from the local storage.
  useEffect(() => {
    let savedWords: Object[] = JSON.parse(localStorage.getItem('savedWords') as string) || [];

    // Manage sorting.
    if (sortBy === SortBy.ALPHA) {
      savedWords = savedWords.sort((a: any, b: any) => 
        a.senses[0].english_definitions[0].localeCompare(b.senses[0].english_definitions[0])
      );
    } else if (sortBy === SortBy.DATE) {
      savedWords = savedWords.sort((a: any, b: any) => 
        new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
      );
    };

    // Manage ordering.
    if (orderBy !== OrderBy.ASC)
      savedWords = savedWords.reverse();
    
    setSavedWords(savedWords);
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
            title={`Order By: ${
              sortBy === SortBy.ALPHA ? (
                orderBy === OrderBy.ASC ? "Z-A" :
                orderBy === OrderBy.NONE ? "A-Z" :
                "Default"
              ) : (
                orderBy === OrderBy.ASC ? "Oldest" :
                orderBy === OrderBy.NONE ? "Newest" :
                "Default"
              )
            }`}
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
