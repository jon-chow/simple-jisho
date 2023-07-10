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
  duration: 0,
  setDuration: (duration: number) => {},
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
  const [duration, setDuration] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>(Status.IDLE);

  // Creates the search history in local storage if it doesn't exist.
  useEffect(() => {
    if (localStorage.getItem("searchHistory") === null)
      setLocalStorage("searchHistory", JSON.stringify([]));
  }, []);

  return (
    <SearchContext.Provider value={{
      query, setQuery,
      status, setStatus,
      duration, setDuration,
    }}>
      { children }
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
