import { useSearch, Status } from "@contexts/SearchProvider";
import { useResults } from "@contexts/ResultsProvider";

import DefaultResults from "@components/DefaultResults";

import Pagination from "@components/Pagination";

import styles from './SearchPage.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates a page that displays search results.
 */
const SearchPage = () => {
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
