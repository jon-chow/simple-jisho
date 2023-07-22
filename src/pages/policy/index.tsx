import Logo from "@src/assets/svg/Logo";

import styles from './PolicyPage.module.scss';

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the cookie policy page. \
 * This page is used to display the cookie policy of the website.
 * @returns The cookie policy page component.
 */
const PolicyPage = (): JSX.Element => {
  return (
    <div className={styles.PolicyPage}>
      <div className={styles.Header}>
        {/* <Logo className={styles.Logo} /> */}
        <h1>Cookie Policy for Simple Jisho</h1>
        <h2>Last updated: July 22, 2023</h2>
      </div>

      <hr />
      
      <blockquote>
        <h2><strong>Definitions</strong></h2>
        <p>
          For the purposes of this Cookie Policy:
        </p>
        <ul>
          <li>
            <p>
              <strong>We</strong> (also referred to as either "Us" or "Our" in this Cookie Policy) refers to Simple Jisho.
            </p>
          </li>
          <li>
            <p>
              <strong>You</strong> (also referred to as "Your" in this Cookie Policy) means the individual, company, or legal entity accessing or using the Website, as applicable.
            </p>
          </li>
          <li>
            <p>
              <strong>Website</strong> (also referred to as either "the Website" or "Site" in this Cookie Policy) refers to the Simple Jisho website, accessible <a href="/" rel="noopener noreferrer" target="_blank">here</a>.
            </p>
          </li>
        </ul>

        <h2><strong>What Are Cookies</strong></h2>
        <p>
          Cookies are small text files of information that are downloaded to Your device when You visit a site, allowing the site to recognize Your device.
          This page describes what information cookies gather, how We use it and why We sometimes need to store these cookies.
          We will also share how You can prevent these cookies from being stored.
        </p>

        <h2><strong>Why We Use Cookies</strong></h2>
        <p>
          We use cookies for a variety of reasons.
          For the Website in particular, We only use cookies to help Us analyze the use patterns of this app (analytics cookies) through tracking user behavior such as page views, clicks, and other actions.
        </p>

        <h2><strong>Disabling Cookies</strong></h2>
        <p>
          You can prevent the setting of cookies by adjusting the settings on Your browser (see Your browser's Help on how to do this).
          Be aware that disabling cookies will also affect the functionality of other websites that You visit in the future.
          Disabling cookies will usually result in also disabling certain functionality and features of a website.
          Therefore, it is recommended that You do not disable cookies.
        </p>

        <h2><strong>The Cookies We Set</strong></h2>
        <p>
          The following section details which first party cookies You might encounter through the Website.
        </p>
        <ul>
          {/* <li>
            <p>Site preferences cookies</p>
            In order to provide You with a great experience on this Site We provide the functionality to set Your preferences for how this Site runs when You use it.
            In order to remember Your preferences We need to set cookies so that this information can be called whenever You interact with a page is affected by Your preferences.
          </li> */}
          <li>
            This Site doesn't set its own cookies. However, some of Our third party services used may set cookies.
          </li>
        </ul>

        <h2><strong>Third Party Cookies</strong></h2>
        <p>
          The following section details which third party cookies You might encounter through this Site.
        </p>
        <ul>
          <li>
            This Site uses Google Analytics, one of the most widespread and trusted analytics solution on the web, for helping Us to understand how You use the Site and ways that We can improve Your experience.
            These cookies may track things such as how long You spend on the Site and the pages that You visit so We can continue to produce and improve features and Site content.
            For more information on Google Analytics cookies, see the official&nbsp;
            <a
              href="https://policies.google.com/technologies/cookies?hl=en-US#how-google-uses-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics
            </a> page.
          </li>
        </ul>
      </blockquote>
    </div>
  );
};

export default PolicyPage;
