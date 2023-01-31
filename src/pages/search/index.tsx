import { useState, useEffect } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import { setLocalStorage } from "@/src/utils/setLocalStorage";

import { useSearch, Status } from "@/contexts/SearchProvider";
import { useResults } from "@/contexts/ResultsProvider";

import DefaultResults from "@/components/DefaultResults/DefaultResults";
import SearchResult from '@/components/SearchResult/SearchResult';

import styles from './SearchPage.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates a page that displays search results.
 */
const SearchPage = () => {
  const [maxResultsPerPage, setMaxResultsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  const { status } = useSearch();
  const { results } = useResults();

  const numPages = Math.ceil(results.length / maxResultsPerPage);
  const startIndex = (currentPage - 1) * maxResultsPerPage;
  const endIndex = startIndex + maxResultsPerPage;
  const resultsToDisplay = results.slice(startIndex, endIndex);

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
    window.addEventListener("storage_settings", handleMaxResultsPerPageChange);
    return () => window.removeEventListener("storage_settings", handleMaxResultsPerPageChange);
  }, []);

  // Set the page to the first page when the results change.
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  return (
    <div className={styles.SearchPage}>
      { (results.length > 0 && status === Status.SUCCESS) ? 
        <>
          <Controls />
          <div className={styles.Results}>
            {renderedResults}
          </div>
          <Controls />
        </> :
        <DefaultResults />
      }
    </div>
  );
};

export default SearchPage;
