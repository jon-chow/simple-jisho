import { AppInfoData } from '@src/configs/config';

import { useSearch, Status } from '@src/contexts/SearchProvider';
import { useResults } from '@src/contexts/ResultsProvider';

import SearchBar from '../SearchBar';

import Logo from '@public/static/logo.svg';

import styles from './TopBar.module.scss';
import styles2 from '@src/styles/Layout.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the top bar of the page.
 * 
 * The top bar contains the application name, its description,
 * as well as a search bar.
 */
const TopBar = () => {
  const searchContext = useSearch();
  const resultsContext = useResults();

  /**
   * Checks the query status and updates the status label.
   */
  const checkStatus = () => {
    switch (searchContext.status) {
      case Status.IDLE: return "Look up a word by entering it into the search bar.";
      case Status.LOADING: return "Searching...";
      case Status.SUCCESS: return `Found ${resultsContext.results.length} results for "${resultsContext.keyword}".`;
      case Status.CANCELLED: return "Search cancelled.";
      default: return "An error occurred while searching.";
    }
  };

  return (
    <header className={styles.TopBar}>
      {/* App Name */}
      <div className={styles.Title}>
        <a className={styles.Logo} href={AppInfoData.repository} no-referrer='noreferrer' target='blank'>
          <Logo />
        </a>
        {AppInfoData.name}
      </div>

      {/* App Description */}
      <div className={styles.Subtitle}>
        A powerful, more compact version of the&nbsp;
        <a className={styles2.UnderlinedLink} href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
          jisho.org
        </a>
        &nbsp;Japanese-English dictionary!
      </div>
      
      {/* Search Bar */}
      <SearchBar />

      <div className={styles.StatusLabel}>
        { checkStatus() }
      </div>
    </header>
  )
};

export default TopBar;
