import { createContext, useContext, useState, PropsWithChildren } from "react";


// Enumerates the different states of a search.
export enum Status {
  IDLE,
  LOADING,
  SUCCESS,
  CANCELLED,
  ERROR
};

// Context for a search.
export const SearchContext = createContext({
  query: "",
  setQuery: (query: string) => {},
  status: Status.IDLE,
  setStatus: (status: Status) => {},
});

// Use the search context.
export const useSearch = () => useContext(SearchContext);

/**
 * Provides the context for search.
 */
const SearchContextProvider = ({ children } : PropsWithChildren) => {
  const [currentSearch, setQuery] = useState("");
  const [searchStatus, setStatus] = useState<Status>(Status.IDLE);

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
