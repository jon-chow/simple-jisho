import { createContext, useContext, useState, PropsWithChildren } from "react";


// Context for the result of a search.
export const ResultsContext = createContext({
  keyword: "",
  setKeyword: (keyword: string) => {},
  results: [] as WordData[],
  setResults: (results: WordData[]) => {},
});

// Use the results context.
export const useResults = () => useContext(ResultsContext);

/**
 * Provides the context for results.
 */
const ResultsContextProvider = ({ children } : PropsWithChildren) => {
  const [resultKeyword, setKeyword] = useState("");
  const [results, setResults] = useState<WordData[]>([]);

  return (
    <ResultsContext.Provider value={{
      results: results, setResults,
      keyword: resultKeyword, setKeyword,
    }}>
      { children }
    </ResultsContext.Provider>
  );
};

export default ResultsContextProvider;
