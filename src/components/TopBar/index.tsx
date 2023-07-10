import { useRef } from 'react';

import { AppInfoData } from '@src/configs/config';
import { useSearch, Status } from '@src/contexts/SearchProvider';
import { useResults } from '@src/contexts/ResultsProvider';
import { VersionData } from '@src/configs/versionHistory';
import useInterval from '@src/hooks/useInterval';

import SearchBar from '../SearchBar';

import Logo from "@src/assets/svg/Logo";

import styles from './TopBar.module.scss';
import styles2 from '@src/styles/Layout.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the top bar of the page. \
 * The top bar contains the application name, its description,
 * as well as a search bar.
 * @return The top bar of the page.
 */
const TopBar = (): JSX.Element => {
  const searchContext = useSearch();
  const resultsContext = useResults();

  const statusRef = useRef<HTMLDivElement>(null);
  
  const VERSION = VersionData[0].version;

  /**
   * Checks the query status and updates the status label.
   * @return The status text.
   */
  const checkStatus = (): string => {
    switch (searchContext.status) {
      case Status.IDLE:      return "Look up a word by entering it into the search bar.";
      case Status.LOADING:   return `Searching for "${searchContext.query}" (${(searchContext.duration / 1000).toFixed(1)}s)...`;
      case Status.SUCCESS:   return `Found ${resultsContext.results.length} results for "${resultsContext.keyword}".`;
      case Status.CANCELLED: return "Search cancelled.";
      default:               return "An error occurred while searching.";
    };
  };

  // Refresh the status label every 100ms.
  useInterval(() => {
    if (searchContext.status === Status.LOADING) {
      searchContext.setDuration(searchContext.duration + 100);

      // Set the status to error if the search takes too long.
      if (searchContext.duration >= 10000)
        searchContext.setStatus(Status.ERROR);
    } else {
      searchContext.setDuration(0);
    };

    if (statusRef.current)
      statusRef.current.innerText = checkStatus();
  }, 100);

  return (
    <header className={styles.TopBar}>
      {/* App Name */}
      <div className={styles.Title}>
        <a className={styles.Logo} href={AppInfoData.repository} no-referrer='noreferrer' target='blank'>
          <Logo />
        </a>
        {AppInfoData.name} {`(v${ VERSION.major }.${ VERSION.minor }.${ VERSION.patch })`}
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

      <div
        className={styles.StatusLabel}
        ref={statusRef}
      >
        { checkStatus() }
      </div>
    </header>
  );
};

export default TopBar;
