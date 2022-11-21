import { useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'

import { FastAverageColor } from 'fast-average-color';
import { FaGithub, FaGithubSquare, FaLinkedin } from 'react-icons/fa'

import styles from '../styles/Home.module.scss'


const appName = "Simple Jisho";

const background : {image: string, artist: string, artistLink: string} = {
  image: "/background.jpg",
  artist: "Alpha Coders",
  artistLink: "https://wall.alphacoders.com/big.php?i=496311"
}

const socialMediaButtons : {title: string, icon: JSX.Element, link: string}[] = [
  {
    title: "GitHub",
    icon: <FaGithubSquare />,
    link: "https://github.com/jon-chow",
  },
  {
    title: "LinkedIn",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/in/ja-chow/",
  },
]


/**
 * Creates the head of the page.
 * 
 * The head contains metadata about the page, such as the title,
 * description (for SEO), and favicon.
 */
const MetaData = () => {
  return (
    <Head>
      <title>{appName}</title>
      <meta charSet="UTF-8" />
      <meta name="description"
        content="A reformatted, simpler version of jisho.org."
      />
      <meta name="keywords"
        content="English, Japanese, Dictionary, Jisho"
      />
      <meta name="author" content="jon-chow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

/**
 * Creates a background for the page.
 * 
 * An image background with an blurring overlay.
 */
const Background = () => {
  return (
    <div className={styles.background}>
      <div className={styles.overlay}/>
      <Image
        className={styles.backgroundImage}
        loader={({ src }) => src}
        src={background.image}
        alt="Background"
        fill={true}
        quality={100}
      />
    </div>
  )
}

/**
 * Creates the header of the page.
 * 
 * The header contains the application name, its description,
 * as well as a search bar.
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>{appName}</div>
      <div className={styles.subtitle}>
        A lighter, more compact version of the&nbsp;
        <a href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
          jisho.org
        </a>
        &nbsp;Japanese-English dictionary!
      </div>
      
      <div className={styles.search}>
        <input className={styles.searchInput} type="text"
          placeholder="English, 日本語, Romaji..."
        />
        <button className={styles.searchButton}>Search</button>
      </div>
    </header>
  )
}

/**
 * Creates the footer of the page.
 * 
 * The footer contains copyright information, social media links,
 * as well as a link to the source code (GitHub) and the Jisho website.
 */
const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Copyright information */}
      <div>
        &copy; {new Date().getFullYear()}&nbsp;
        <a href="https://github.com/jon-chow" no-referrer='noreferrer' target='blank'>
          jon-chow
        </a>.
      </div>

      {/* Social media links */}
      {(socialMediaButtons ) &&
        <div className={styles.socials}>
          {socialMediaButtons.map((button, index) => {
            return (
              <a
                className={styles.socialMediaButton}
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
        <a href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
          jisho.org
        </a>
        &nbsp;API.
      </div>
      
      {/* Tech stack information */}
      <div>
        Simple Jisho was created using SASS/SCSS, Next.js, and TypeScript.
      </div>

      {/* Credits to background artist (if exists) */}
      {(background.artist != "") &&
        <div>
          Background wallpaper obtained from&nbsp;
          <a href={background.artistLink} no-referrer='noreferrer' target='blank'>
            {background.artist}
          </a>.
        </div>
      }

      {/* Link to GitHub repository */}
      <div className={styles.repository}>
        <a
          className={styles.repositoryButton}
          href="https://github.com/jon-chow/simple-jisho"
          title={appName + " on GitHub"}
          no-referrer='noreferrer'
          target='blank'
        >
          <FaGithub />
        </a>
      </div>
    </footer>
  )
}

/**
 * Exports the Home component.
 * 
 * The Home component is basically the entire page.
 */
export default function Home() {
  // Changes the colour of buttons and text based on the background image.
  const hoverHandler = (button: HTMLElement, color: string) => {
    const prev = button.style.color;
    button.onmouseover = () => {
      button.style.color = color;
    }
    button.onmouseleave = () => {
      button.style.color = prev;
    }
  }

  useEffect(() => {
    const fac = new FastAverageColor();
    fac.getColorAsync(background.image).then(color => {
      const smButtons = Array.from(document.getElementsByClassName(styles.socialMediaButton) as HTMLCollectionOf<HTMLElement>);
      const repoButton = document.getElementsByClassName(styles.repositoryButton)[0] as HTMLElement;
      
      smButtons.forEach(button => {
        hoverHandler(button, color.hex);
      });
      hoverHandler(repoButton, color.hex);
    }).catch(e => {
      console.log(e);
    });
  }, []);

  return (
    <div className={styles.container}>
      <MetaData />

      <Background />
      <Header />
      <main className={styles.main}>
        
      </main>
      <Footer />
    </div>
  )
}
