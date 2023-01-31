import { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import SearchResult from '@/components/SearchResult/SearchResult';

import Logo from '@/public/static/logo.svg';

import styles from './BookmarksPage.module.scss';


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
  const [maxResultsPerPage, setMaxResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const numPages = Math.ceil(savedWords.length / maxResultsPerPage);
  const startIndex = (currentPage - 1) * maxResultsPerPage;
  const endIndex = startIndex + maxResultsPerPage;
  const resultsToDisplay = savedWords.slice(startIndex, endIndex);

  // Changes the current page to the next page.
  const nextPage = () => {
    (currentPage < numPages) ? setPage(currentPage + 1) : setPage(1);
  };

  // Changes the current page to the previous page.
  const prevPage = () => {
    (currentPage > 1) ? setPage(currentPage - 1) : setPage(numPages);
  };

  // Changes the current page to the specified page.
  const setPage = (page : number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Renders the results to display on the current page.
  const renderedResults = resultsToDisplay.map((result : any, index : number) => (
    <SearchResult key={index} resultData={result} />
  ));

  // Renders the page number buttons.
  const renderedPageNumbers = Array.from(Array(numPages).keys()).map((page) => (
    <button
      key={page}
      className={styles.PaginationPageNumber}
      disabled={currentPage === page + 1}
      onClick={() => setPage(page + 1)}
    >
      {page + 1}
    </button>
  ));

  // Renders the pagination controls.
  const Controls = () => (
    <div className={styles.Controls}>
      <div className={styles.Buttons}>
        <button
          className={styles.PaginationButton}
          disabled={currentPage === 1}
          onClick={prevPage}
        >
          <BsArrowLeft />
        </button>

        {renderedPageNumbers}

        <button
          className={styles.PaginationButton}
          disabled={currentPage === numPages}
          onClick={nextPage}
        >
          <BsArrowRight />
        </button>
      </div>

      <div className={styles.PaginationPageSelect}>
        Page 
        <select
          value={currentPage}
          onChange={(e) => setPage(parseInt(e.target.value))}
        >
          {Array.from(Array(numPages).keys()).map((page) => (
            <option key={page} value={page + 1}>
              {page + 1}
            </option>
          ))}
        </select>
        of {numPages}
      </div>
    </div>
  );

  // Handle max results per page changes.
  const handleMaxResultsPerPageChange = () => {
    const settings = localStorage.getItem("settings");

    if (settings) {
      const parsedSettings = JSON.parse(settings);
      parsedSettings.maxResultsToDisplay &&
        setMaxResultsPerPage(parsedSettings.maxResultsToDisplay);
    };
  };

  // Update the max results per page from event listeners.
  useEffect(() => {
    handleMaxResultsPerPageChange();

    window.addEventListener("storage_settings", handleMaxResultsPerPageChange);
    return () => window.removeEventListener("storage_settings", handleMaxResultsPerPageChange);
  }, []);

  // Set the page to the first page when the results change.
  useEffect(() => {
    setCurrentPage(1);
  }, [savedWords]);

  // Fetch saved words from the local storage.
  useEffect(() => {
    const savedWords = localStorage.getItem('savedWords');
    savedWords && setSavedWords(JSON.parse(savedWords));
  }, []);

  return (
    <div className={styles.BookmarksPage}>
      { (savedWords.length > 0) ? 
        <>
          <Controls />
          <div className={styles.Results}>
            {renderedResults}
          </div>
          <Controls />
        </> :
        <div className={styles.NoResults}>
          <Logo className={styles.Logo} />
          <h1>No terms were saved!</h1>
          <p>Try searching for a word and saving it!</p>
        </div>
      }
    </div>
  );
};

export default BookmarksPage;
