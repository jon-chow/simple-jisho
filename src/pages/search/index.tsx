import { useState, useContext } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import { Status, SearchContext, ResultsContext } from "../../configs/config";

import DefaultResults from "../../components/DefaultResults";
import SearchResult from '../../components/SearchResult';

import styles from '../../styles/SearchPage.module.scss';


const MAX_RESULTS_PER_PAGE = 5;

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates a page that displays search results.
 */
const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { status } = useContext(SearchContext);
  const { results } = useContext(ResultsContext);

  const numPages = Math.ceil(results.length / MAX_RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * MAX_RESULTS_PER_PAGE;
  const endIndex = startIndex + MAX_RESULTS_PER_PAGE;
  const resultsToDisplay = results.slice(startIndex, endIndex);

  // Changes the current page to the next page.
  const nextPage = () => {
    (currentPage < numPages) ? setCurrentPage(currentPage + 1) : setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  // Changes the current page to the previous page.
  const prevPage = () => {
    (currentPage > 1) ? setCurrentPage(currentPage - 1) : setCurrentPage(numPages);
    window.scrollTo(0, 0);
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
