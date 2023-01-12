import Image from 'next/image';

import styles from '../styles/DefaultResults.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the default results panel.
 * 
 * The default results page is shown when the user first visits the page,
 * or when they search using an empty query.
 */
const DefaultResults = () => {
  return (
    <article className={styles.DefaultResults}>
      <div className={styles.DefaultResultsHeader}>
        <Image src="/favicon.ico" alt="Logo" width={60} height={60} />
        <span className={styles.DefaultResultsTitle}>About Simple Jisho</span>
      </div>

      <p className={styles.DefaultResultsParagraph}>
        Simple Jisho is a simplified version of the Jisho Japanese-English dictionary.
        <br /><br />
        Using the Jisho API, it lets you find words, kanji, and example sentences with ease.
        <br /><br />
        Just enter any Japanese, English, or Romaji text into the search box and allow Simple Jisho
        to handle the rest!
      </p>

      <p className={styles.DefaultResultsParagraph}>
        シンプルジショはJisho.orgの簡単なバージョンです。
        <br /><br />
        Jisho APIを使用して、単語、漢字、例文を簡単に見つけることができます。
        <br /><br />
        検索ボックスに日本語、英語、ローマ字のテキストを入力して、シンプルジショに残りの処理を任せてください！
      </p>
    </article>
  );
};

export default DefaultResults;
