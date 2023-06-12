import { createContext, useContext, useState, PropsWithChildren } from "react";


/**
 * The result context.
 */
export const ResultsContext = createContext({
  keyword: "",
  setKeyword: (keyword: string) => {},
  results: [] as WordData[],
  setResults: (results: WordData[]) => {},
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Uses the results context.
 * @returns The results context.
 */
export const useResults = () => useContext(ResultsContext);

/**
 * Provides the context for results.
 * @param children The children of the component.
 * @returns The results context provider.
 */
const ResultsContextProvider = ({ children } : PropsWithChildren): JSX.Element => {
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
