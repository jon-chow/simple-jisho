import { useContext } from 'react';
import Image from 'next/image';

import { Status, SearchContext, ResultsContext, AppInfoData } from '../configs/config';

import SearchBar from '../components/SearchBar';

import styles from '../styles/Header.module.scss';
import styles2 from '../styles/Home.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the header of the page.
 * 
 * The header contains the application name, its description,
 * as well as a search bar.
 */
const Header = () => {
  const searchContext = useContext(SearchContext);
  const resultsContext = useContext(ResultsContext);

  /**
   * Checks the query status and updates the status label.
   */
  const checkStatus = () => {
    switch (searchContext.status) {
      case Status.IDLE:
        return <div className={styles.StatusLabel}>Look up a word by entering it into the search bar.</div>;
      case Status.LOADING:
        return <div className={styles.StatusLabel}>Searching...</div>;
      case Status.SUCCESS:
        return <div className={styles.StatusLabel}>
          Found {resultsContext.results.length} results for
          &quot;<span className={styles.keyword}>{resultsContext.keyword}</span>&quot;.
        </div>;
      case Status.CANCELLED:
        return <div className={styles.StatusLabel}>Search cancelled.</div>;
      default:
        return <div className={styles.StatusLabel}>An error occurred while searching.</div>;
    }
  };

  return (
    <header className={styles.Header}>
      {/* App Name */}
      <div className={styles.Title}>
        <a className={styles.Logo} href={AppInfoData.repository} no-referrer='noreferrer' target='blank'>
          <Image
            src={AppInfoData.logo}
            alt="Logo"
            title={AppInfoData.name}
            width={40}
            height={40}
          />
        </a>
        {AppInfoData.name}
      </div>

      {/* App Description */}
      <div className={styles.Subtitle}>
        A lighter, more compact version of the&nbsp;
        <a className={styles2.UnderlinedLink} href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
          jisho.org
        </a>
        &nbsp;Japanese-English dictionary!
      </div>
      
      {/* Search Bar */}
      <SearchBar />

      { checkStatus() }
    </header>
  )
};

export default Header;
