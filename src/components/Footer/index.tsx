import { FaGithub, FaBook } from 'react-icons/fa';

import { AppInfoData, BackgroundData, SMButtonsData, TechStackData } from '@src/configs/config';

import { useModal, ModalType, toggleModal } from '@src/contexts/ModalProvider';

import styles from './Footer.module.scss';
import styles2 from '@src/styles/Layout.module.scss';


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
  const devLogsContext = useModal();

  return (
    <footer className={styles.Footer}>
      {/* Copyright information */}
      <div>
        &copy; 2022-{new Date().getFullYear()} jon-chow.
      </div>

      {/* Social media links */}
      { (SMButtonsData) &&
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
          href="https://github.com/mistval/unofficial-jisho-api"
          no-referrer='noreferrer'
          target='blank'
          className={styles2.UnderlinedLink}
        >
          unofficial
        </a>
        &nbsp;jisho.org API, an encapsulation of the&nbsp;
        <a
          href="https://jisho.org/forum/54fefc1f6e73340b1f160000-is-there-any-kind-of-search-api"
          no-referrer='noreferrer'
          target='blank'
          className={styles2.UnderlinedLink}
        >
          official
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
        { TechStackData.map((tech, index) => 
          <span key={index}>
            {index !== TechStackData.length - 1 ? "" : "and "}
            <a href={tech.link} no-referrer='noreferrer' target='blank' className={styles2.UnderlinedLink}>
              {tech.name}
            </a>
            {index !== TechStackData.length - 1 ? ", " : "."}
          </span>
        )}
      </div>

      {/* Credits to background artist (if exists) */}
      { (BackgroundData.artist !== "") &&
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

      {/* Dev logs */}
      <div className={styles.DevLogs}>
        <button
          className={styles.DevLogsButton}
          onClick={() => { toggleModal(devLogsContext, ModalType.DEVLOGS); }}
        >
          <FaBook /> Dev Logs
        </button>
      </div>
    </footer>
  );
};

export default Footer;
