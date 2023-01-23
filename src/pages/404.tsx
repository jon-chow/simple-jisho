import Link from 'next/link';

import styles from '../styles/ErrorPage.module.scss';


const ErrorPage = () => {
  return (
    <div className={styles.ErrorPage}>
      <h1>404 - Page Not Found</h1>
      
      <hr />

      <blockquote>
        Sorry, the page you are looking for does not exist.
        <br />
        <Link href="/">Return to the homepage</Link>
      </blockquote>
    </div>
  );
};

export default ErrorPage;
