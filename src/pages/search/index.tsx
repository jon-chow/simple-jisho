import { useSearch, Status } from "@src/contexts/SearchProvider";
import { useResults } from "@src/contexts/ResultsProvider";

import DefaultResults from "@src/components/DefaultResults";

import Pagination from "@src/components/Pagination";

import styles from './SearchPage.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Exports the search page. \
 * Creates a page that displays search results.
 * @returns The search page.
 */
const SearchPage = (): JSX.Element => {
  const { status } = useSearch();
  const { results } = useResults();

  return (
    <div className={styles.SearchPage}>
      <Pagination
        results={results}
        condition={results.length > 0 && status === Status.SUCCESS}
        default={<DefaultResults />}
      />
    </div>
  );
};

export default SearchPage;
