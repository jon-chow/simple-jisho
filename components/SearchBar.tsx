import { useEffect, useState, useContext } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';

import { Status, SearchContext, ResultsContext } from '../configs/config';

import styles from '../styles/SearchBar.module.scss';


/**
 * Extended Promise to allow for cancellation.
 */ 
interface PromiseWithCancel<T> extends Promise<T> {
  cancel: () => void;
};

/**
 * Checks if an error is an AbortError.
 * @param error The error to check.
 */
const isAbortError = (error: any): error is DOMException => {
  return (error && error.name === "AbortError");
};

/**
 * Calls to the search API and returns the results.
 * @param query The query to search for.
 * @exception AbortError thrown when the search is cancelled.
 */
const getSearchResults = (query: string) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = new Promise(async (resolve) => {
    try {
      const response = await fetch(`/api/search?keyword=${query.toLowerCase()}`, {
        method: 'GET',
        signal
      });
      const data = await response.json();
      resolve(data);
    } catch (exception: unknown) {
      if (isAbortError(exception))
        throw exception;
    };
  });

  (promise as PromiseWithCancel<any>).cancel = () => controller.abort();

  return promise as PromiseWithCancel<any>;
};

/**
 * Retrieves the value of the query parameter with the given key.
 * @param variable Key variable to look for in the URL.
 * @returns The value of the key variable in the URL.
 */
const getQueryVariable = (variable: string) => {
  const vars = window.location.search.substring(1).split('&');

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable)
      return decodeURIComponent(pair[1]);
  };
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the search bar component.
 * 
 * The search bar is included in the header.
 */
const SearchBar = () => {
  const searchContext = useContext(SearchContext);
  const resultsContext = useContext(ResultsContext);
  const [querying, setQuerying] = useState<PromiseWithCancel<any> | undefined>(undefined);

  const cancelQuery = () => {
    querying?.cancel();
    searchContext.setStatus(Status.CANCELLED);
  };

  /**
   * Runs a dictionary search for the given query term.
   * @param query The query to search for.
   * @param addHistory Whether to add the search to the browser history.
   */
  const search = async (query: string, addHistory: boolean = true) => {
    // Check if query was the same as the previous one.
    if (query === searchContext.query)
      return;

    // Check if query is not empty.
    if (query) {
      cancelQuery();
      const q = getSearchResults(query);
      setQuerying(q);
      searchContext.setStatus(Status.LOADING);

      q.then((data) => {
        resultsContext.setKeyword(query);
        resultsContext.setResults(data);
        searchContext.setStatus(Status.SUCCESS);
        (addHistory) && window.history.pushState(null, "", (query) ? "?q=" + query : "");
      }).catch((error) => {
        console.error(error);
        searchContext.setStatus(Status.ERROR);
      });
    } else {
      resultsContext.setKeyword("");
      resultsContext.setResults([]);
      searchContext.setStatus(Status.IDLE);
      (addHistory) && window.history.pushState(null, document.title, "/");
    }

    searchContext.setQuery(query);
  };

  // Handles the search bar submission button.
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const query = event.target.search.value;
    search(query);
  };

  // Automatically searches for the query parameter in the URL.
  useEffect(() => {
    const handlePopState = () => {
      const keyword = getQueryVariable("q");
      (keyword) && search(keyword, false);
    };

    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);


  return (
    <form className={styles.Search} onSubmit={(e) => handleSubmit(e)}>
      {/* Search Input */}
      <input
        className={styles.SearchInput}
        type="text"
        name="search"
        id="search"
        placeholder="English, 日本語, Romaji..."
      />

      {/* Control Buttons */}
      <div className={styles.SearchControls}>
        <button type="submit" title="Search">
          <FaSearch />
        </button>
        <button type="reset" title="Clear">
          <FaTrashAlt />
        </button>
        {/* <button type="button" title="History">
          <FaHistory />
        </button> */}
      </div>
    </form>
  );
};

export default SearchBar;
