import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import SearchResult from './SearchResult';

import styles from '../styles/Pagination.module.scss';


const MAX_RESULTS_PER_PAGE = 5;



/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates a page that displays search results.
 * 
 * Pagination is used to display the results.
 * @param props results: The results to display on the current page.
 */
const Pagination = (props : {results : any }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { results } = props;
  const numPages = Math.ceil(results.length / MAX_RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * MAX_RESULTS_PER_PAGE;
  const endIndex = startIndex + MAX_RESULTS_PER_PAGE;
  const resultsToDisplay = results.slice(startIndex, endIndex);

  // Scroll to the top of the page when the current page changes.
  window.scrollTo(0, 0);

  // Changes the current page to the next page.
  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(1);
    }
  };

  // Changes the current page to the previous page.
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(numPages);
    }
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
      onClick={() => setCurrentPage(page + 1)}
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
          onChange={(e) => setCurrentPage(parseInt(e.target.value))}
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

  return (
    <div className={styles.Pagination}>
      <Controls />

      <div className={styles.Results}>
        {renderedResults}
      </div>

      <Controls />
    </div>
  );
};

export default Pagination;
