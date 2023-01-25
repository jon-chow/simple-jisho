import { useEffect, useState } from 'react';

import SearchResult from '../../components/SearchResult';

import Logo from '../../../public/static/logo.svg';

import styles from '../../styles/BookmarksPage.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the bookmarks page.
 * 
 * The bookmarks page is a page that displays all the bookmarks that the user has saved.
 */
const BookmarksPage = () => {
  const [savedWords, setSavedWords] = useState<string[]>([]);

  // Fetch saved words from the local storage.
  useEffect(() => {
    const savedWords = localStorage.getItem('savedWords');
    savedWords && setSavedWords(JSON.parse(savedWords));
  }, []);

  return (
    <div className={styles.BookmarksPage}>
      { (savedWords.length > 0) ? 
        <>
          <div className={styles.Results}>
            { savedWords.map((word : any, index : number) => (
              <SearchResult key={index} resultData={word} />
            )) }
          </div>
        </> :
        <div className={styles.NoResults}>
          <Logo className={styles.Logo} />
          <h1>No terms were saved!</h1>
          <p>Try searching for a word and saving it!</p>
        </div>
      }
    </div>
  );
};

export default BookmarksPage;
