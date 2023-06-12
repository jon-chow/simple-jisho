import Link from 'next/link';

import Logo from "@src/assets/svg/Logo";

import styles from './ErrorPage.module.scss';

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the error page. \
 * The error page is shown when the user visits a page that does not exist.
 * @returns The error page component.
 */
const ErrorPage = (): JSX.Element => {
  return (
    <div className={styles.ErrorPage}>
      <div className={styles.Header}>
        <Logo className={styles.Logo} />
        <h1>404 - Page Not Found</h1>
      </div>
      
      <hr />

      <blockquote>
        Sorry, the page you are looking for does not exist.
        <br />
        It may have been moved or deleted.
        <br />
        <Link href="/">Return to the homepage</Link>
      </blockquote>
    </div>
  );
};

export default ErrorPage;
