import { FaGithub } from 'react-icons/fa';

import { AppInfoData, BackgroundData, SMButtonsData } from '../configs/config';

import styles from '../styles/Footer.module.scss';
import styles2 from '../styles/Home.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the footer of the page.
 * 
 * The footer contains copyright information, social media links,
 * as well as a link to the source code (GitHub) and the Jisho website.
 */
const Footer = () => {
  return (
    <footer className={styles.Footer}>
      {/* Copyright information */}
      <div>
        &copy; 2022-{new Date().getFullYear()} jon-chow.
      </div>

      {/* Social media links */}
      {(SMButtonsData) &&
        <div className={styles.Socials}>
          {SMButtonsData.map((button, index) => {
            return (
              <a
                className={styles.SocialMediaButton}
                key={index}
                href={button.link}
                title={button.title}
                no-referrer='noreferrer'
                target='blank'
              >
                {button.icon}
              </a>
            )
          })}
        </div>
      }

      {/* Credits to jisho.org API */}
      <div>
        This app makes calls to the&nbsp;
        <a
          href="https://jisho.org/"
          no-referrer='noreferrer'
          target='blank'
          className={styles2.UnderlinedLink}
        >
          jisho.org
        </a>
        &nbsp;API.
      </div>

      {/* Attributes */}
      <div>
        All dictionary data is obtained from jisho.org, 
        which is attributed to their respective sources.
      </div>
      
      {/* Tech stack information */}
      <div>
        Simple Jisho was created using&nbsp;
        <a href="https://sass-lang.com/" no-referrer='noreferrer' target='blank'
          className={styles2.UnderlinedLink}>
          SASS/SCSS
        </a>,&nbsp;
        <a href="https://nextjs.org/" no-referrer='noreferrer' target='blank'
          className={styles2.UnderlinedLink}>
          Next.js
        </a>, and&nbsp;
        <a href="https://www.typescriptlang.org/" no-referrer='noreferrer' target='blank'
          className={styles2.UnderlinedLink}>
          TypeScript
        </a>,
      </div>

      {/* Credits to background artist (if exists) */}
      {(BackgroundData.artist != "") &&
        <div>
          Background wallpaper obtained from&nbsp;
          <a
            href={BackgroundData.artistLink}
            no-referrer='noreferrer'
            target='blank'
            className={styles2.UnderlinedLink}
          >
            {BackgroundData.artist}
          </a>.
        </div>
      }

      {/* Link to GitHub repository */}
      <div className={styles.Repository}>
        <a
          className={styles.RepositoryButton}
          href={AppInfoData.repository}
          title={AppInfoData.name + " on GitHub"}
          no-referrer='noreferrer'
          target='blank'
        >
          <FaGithub />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
