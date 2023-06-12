import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";

import { setLocalStorage } from "@src/utils/setLocalStorage";


/**
 * Enum for search states.
 */
export enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  CANCELLED = "cancelled",
  ERROR = "error",
};

/**
 * The search context.
 */
export const SearchContext = createContext({
  query: "",
  setQuery: (query: string) => {},
  status: Status.IDLE,
  setStatus: (status: Status) => {},
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Uses the search context.
 * @returns The search context.
 */
export const useSearch = () => useContext(SearchContext);

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Provides the context for search.
 * @param children The children of the component.
 * @returns The search context provider.
 */
const SearchContextProvider = ({ children } : PropsWithChildren): JSX.Element => {
  const [currentSearch, setQuery] = useState("");
  const [searchStatus, setStatus] = useState<Status>(Status.IDLE);

  // Creates the search history in local storage if it doesn't exist.
  useEffect(() => {
    if (localStorage.getItem("searchHistory") === null)
      setLocalStorage("searchHistory", JSON.stringify([]));
  }, []);

  return (
    <SearchContext.Provider value={{
      query: currentSearch, setQuery,
      status: searchStatus, setStatus
    }}>
      { children }
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
