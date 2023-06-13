import { useState, useEffect } from 'react';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

import SearchResult from '@src/components/SearchResult';

import styles from './Pagination.module.scss';


const BUTTONS_TO_SHOW = 5; // Must be odd number.

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the a pagination component. \
 * Shows a specified number of results per page and allows the user to navigate between pages.
 * @param props The properties of the pagination component.
 * @param props.results The results to display.
 * @param props.condition The condition for the pagination component to be displayed.
 * @param props.default The default component to display if the condition is false.
 * @return The pagination component.
 */
const Pagination = (props: { results: any[], condition: boolean, default: React.ReactElement }): JSX.Element => {
  const [maxResultsPerPage, setMaxResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const numPages = Math.ceil(props.results.length / maxResultsPerPage);
  const startIndex = (currentPage - 1) * maxResultsPerPage;
  const endIndex = startIndex + maxResultsPerPage;
  const resultsToDisplay = props.results.slice(startIndex, endIndex);

  /**
   * Changes the current page to the next page.
   */
  const nextPage = (): void => {
    (currentPage < numPages) ? setPage(currentPage + 1) : setPage(1);
  };

  /**
   * Changes the current page to the previous page.
   */
  const prevPage = (): void => {
    (currentPage > 1) ? setPage(currentPage - 1) : setPage(numPages);
  };

  /**
   * Changes the current page to the specified page.
   * @param page The page to change to.
   */
  const setPage = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  /**
   * Truncates page buttons to only show a specified number of buttons.
   * @param page The page to truncate.
   * @returns The truncated page button.
   */
  const truncatePageButtons = (page: number): JSX.Element | null => {
    // Button element to render.
    const ButtonElement = (): JSX.Element => (
      <button
        className={styles.PaginationPageNumber}
        disabled={currentPage === page + 1}
        onClick={() => setPage(page + 1)}
      >
        {page + 1}
      </button>
    );

    const firstHalf = (BUTTONS_TO_SHOW + 1) / 2;
    const secondHalf = BUTTONS_TO_SHOW - firstHalf;

    if (numPages <= BUTTONS_TO_SHOW)
      return <ButtonElement key={page} />
    else if (currentPage < firstHalf)
      return (page < BUTTONS_TO_SHOW) ? <ButtonElement key={page} /> : null;
    else if (currentPage > numPages - secondHalf)
      return (page + 1 > numPages - BUTTONS_TO_SHOW) ? <ButtonElement key={page} /> : null;
    else
      return ((page + 1 > currentPage - firstHalf) && (page < currentPage + secondHalf)) ? <ButtonElement key={page} /> : null;
  };
  
  // Renders the results to display on the current page.
  const renderedResults = resultsToDisplay.map((result : any, index : number) => (
    <SearchResult key={index} resultData={result} />
  ));
  
  /**
   * Renders the pagination controls.
   * @returns The pagination controls.
   */
  const Controls = (): JSX.Element => (
    <div className={styles.Controls}>
      <div className={styles.Buttons}>
        <button
          className={styles.PaginationButton}
          disabled={currentPage === 1}
          onClick={() => setPage(1)}
          title="First Page"
        >
          <FaAngleDoubleLeft />
        </button>

        <button
          className={styles.PaginationButton}
          disabled={currentPage === 1}
          onClick={prevPage}
          title="Previous Page"
        >
          <FaAngleLeft />
        </button>

        {/* Page Numbers */}
        { Array.from(Array(numPages).keys()).map((page) => (
          truncatePageButtons(page)
        ))}

        <button
          className={styles.PaginationButton}
          disabled={currentPage === numPages}
          onClick={nextPage}
          title="Next Page"
        >
          <FaAngleRight />
        </button>

        <button
          className={styles.PaginationButton}
          disabled={currentPage === numPages}
          onClick={() => setPage(numPages)}
          title="Last Page"
        >
          <FaAngleDoubleRight />
        </button>
      </div>

      <div className={styles.PaginationPageSelect}>
        Page 
        <select
          name="page-selection"
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

  /**
   * Handles changes to the max results per page.
   */
  const handleMaxResultsPerPageChange = (): void => {
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
  }, [props.results]);

  return (
    <>
      { (props.condition) ?
        <>
          <Controls />
          <div className={styles.Results}>
            { renderedResults }
          </div>
          <Controls />
        </> :
        props.default
      }
    </>
  );
};

export default Pagination;
