import { useEffect, useState } from 'react';

import Pagination from '@components/Pagination';

import Logo from '@public/static/logo.svg';

import styles from './BookmarksPage.module.scss';


// Default component that is displayed when there are no bookmarks.
const Default = () => (
  <div className={styles.NoResults}>
    <Logo className={styles.Logo} />
    <h1>No terms were saved!</h1>
    <p>Try searching for a word and saving it!</p>
  </div>
);

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
      <Pagination
        results={savedWords}
        condition={savedWords.length > 0}
        default={<Default />}
      />
    </div>
  );
};

export default BookmarksPage;
