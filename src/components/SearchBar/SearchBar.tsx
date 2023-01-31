import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaHome, FaTable, FaStar, FaSearch, FaTrashAlt, FaHistory, FaCog } from 'react-icons/fa';

import { setLocalStorage } from '@/src/utils/setLocalStorage';

import { useSearch, Status } from '@/contexts/SearchProvider';
import { useResults } from '@/contexts/ResultsProvider';
import { useModal, ModalType, toggleModal } from '@/contexts/ModalProvider';

import styles from './SearchBar.module.scss';


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

const NavButtons = [
  {
    title: 'Home',
    icon: <FaHome />,
    link: '/'
  },
  {
    title: 'Kana Chart',
    icon: <FaTable />,
    link: '/kana'
  },
  {
    title: 'Bookmarks',
    icon: <FaStar />,
    link: '/bookmarks'
  }
]

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the search bar component.
 * 
 * The search bar is included in the header.
 */
const SearchBar = () => {
  const [maxSearchHistory, setMaxSearchHistory] = useState<number>(10);

  const searchContext = useSearch();
  const resultsContext = useResults();
  const modalContext = useModal();

  const [querying, setQuerying] = useState<PromiseWithCancel<any> | undefined>(undefined);

  const router = useRouter();

  // Updates the search history.
  const updateSearchHistory = (query: SearchHistory) => {
    // Ignore empty queries.
    if (query.results.length === 0) return;

    // Update the search history.
    const searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      const history = JSON.parse(searchHistory) as SearchHistory[];
      const index = history.findIndex((item) => item.keyword === query.keyword);

      (index !== -1) && history.splice(index, 1);
      
      (history.length >= maxSearchHistory) && history.shift();
      
      history.push(query);
      setLocalStorage("searchHistory", JSON.stringify(history));
    };
  };

  // Cancels the current search.
  const cancelQuery = () => {
    querying?.cancel();
    setQuerying(undefined);
    searchContext.setQuery("");
    searchContext.setStatus(Status.CANCELLED);
    
    setTimeout(() => {
      if (searchContext.status === Status.CANCELLED)
        searchContext.setStatus(Status.IDLE);
    }, 1000);
  };

  // Handles the search bar submission button.
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const query = event.target.search.value;
    search(query);
  };

  /**
   * Navigates to a specified page via pathname.
   * @param pathname The pathname to navigate to. If undefined, navigates to the home page.
   */
  const navigatePages = (pathname? : string) => {
    cancelQuery();
    resultsContext.setKeyword("");
    resultsContext.setResults([]);
    searchContext.setStatus(Status.IDLE);

    router.push(pathname ? pathname : "/", undefined, { shallow: true });
    const input = document.getElementById("search") as HTMLInputElement;
    input.value = "";
  };

  // Adds the search to the browser history.
  const pushHistoryState = (query: string, data : any) => {
    cancelQuery();
    
    const historyItem : SearchHistory = {
      keyword: query,
      results: data,
      date: new Date(),
    };

    resultsContext.setKeyword(query);
    resultsContext.setResults(data);
    searchContext.setStatus(Status.SUCCESS);

    updateSearchHistory(historyItem);
    router.push({ pathname: "/search", query: { q: query } }, undefined, { shallow: true });
  };

  /**
   * Runs a dictionary search for the given query term.
   * @param query The query to search for.
   */
  const search = async (query: string) => {
    if (query) {
      // Check if query was the same as the previous one.
      if (query === searchContext.query) return;

      // Check if query exists in local storage and if so, use that.
      const searchHistory = localStorage.getItem("searchHistory");
      if (searchHistory) {
        const history = JSON.parse(searchHistory) as SearchHistory[];
        const index = history.findIndex((item) => item.keyword === query);

        if (index !== -1) {
          pushHistoryState(query, history[index].results);
          searchContext.setQuery(query);
          return;
        };
      };

      // Otherwise, run a new search.
      cancelQuery();
      const q = getSearchResults(query);
      setQuerying(q);
      searchContext.setStatus(Status.LOADING);
      q.then((data) => {
        // console.log(data);
        pushHistoryState(query, data);
      }).catch((error) => {
        console.error(error);
        searchContext.setStatus(Status.ERROR);
      });
      searchContext.setQuery(query);
    } else {
      navigatePages();
    };
  };

  // Handle max search history changes.
  const handleMaxSearchHistory = () => {
    const settings = localStorage.getItem("settings");

    if (settings) {
      const parsedSettings = JSON.parse(settings);
      parsedSettings.maxSearchHistory &&
        setMaxSearchHistory(parsedSettings.maxSearchHistory);
    };
  };

  // Update the max results per page from event listeners.
  useEffect(() => {
    handleMaxSearchHistory();

    window.addEventListener("storage_settings", handleMaxSearchHistory);
    return () => window.removeEventListener("storage_settings", handleMaxSearchHistory);
  }, []);

  // Automatically searches for the query parameter in the URL.
  useEffect(() => {
    const handlePopState = () => {
      const keyword = getQueryVariable("q")?.replace(/\+/g, " ");
      (keyword) ? search(keyword) :
      (router.pathname === "/search") ? navigatePages() :
      null;
    };
    
    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <form className={styles.Search} onSubmit={(e) => handleSubmit(e)}>
      {/* Navigation Buttons */}
      <div className={styles.Navigation}>
        { NavButtons.map((button, index) => (
          <button
            key={index}
            className={(router.pathname === button.link) ? styles.Active : undefined}
            type="button"
            title={button.title}
            onClick={() => navigatePages(button.link)}
          >
            { button.icon }
          </button>
        ))}
      </div>

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
        <button 
          className={(router.pathname === '/search') ? styles.Active : undefined}
          type="submit"
          title="Search"
        >
          <FaSearch />
        </button>

        <button
          type="reset"
          title="Clear"
        >
          <FaTrashAlt />
        </button>

        <button
          type="button"
          title="Search History"
          onClick={() => { toggleModal(modalContext, ModalType.SEARCH_HISTORY); }}
        >
          <FaHistory />
        </button>

        <button
          type="button"
          title="Settings"
          onClick={() => { toggleModal(modalContext, ModalType.SETTINGS); }}
        >
          <FaCog /> 
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
