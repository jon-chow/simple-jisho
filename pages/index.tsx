import { useEffect, useState, createContext, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { FastAverageColor } from 'fast-average-color';
import { FaGithub, FaGithubSquare, FaLinkedin, FaHistory } from 'react-icons/fa';

import styles from '../styles/Home.module.scss';


/* -------------------------------------------------------------------------- */
/*                                DECLARATIONS                                */
/* -------------------------------------------------------------------------- */
const appName = "Simple Jisho";

const background : {image: string, artist: string, artistLink: string} = {
  image: "/background.jpg",
  artist: "Alpha Coders",
  artistLink: "https://wall.alphacoders.com/big.php?i=496311",
};

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
];


/* -------------------------------------------------------------------------- */
/*                            REPLICABLE COMPONENTS                           */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- PANEL --------------------------------- */
const Panel = (props: any) => {
  return (
    <div className="panel">
      <h1>{props.title}</h1>
      <div>{props.children}</div>
    </div>
  );
};

const Result = (props: any) => {
  return (
    <div className="result">
      <h2>{props.title}</h2>
      <div>{props.children}</div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                               PAGE COMPONENTS                              */
/* -------------------------------------------------------------------------- */

/* -------------------------------- METADATA -------------------------------- */
/**
 * Creates the head of the page.
 * 
 * The head contains metadata about the page, such as the title,
 * description (for SEO), and favicon.
 */
const MetaData = () => {
  const search = useContext(SearchContext);
  const [title, setTitle] = useState(appName);

  useEffect(() => {
    (search.query) ? setTitle(`${search.query} - ${appName}`) : setTitle(`${appName}: Japanese Dictionary`);
  }, [search.query]);

  return (
    <Head>
      <title>{title}</title>
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
  );
};

/* ------------------------------- BACKGROUND ------------------------------- */
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
  );
};


/* ------------------------------- SEARCH BAR ------------------------------- */
/**
 * Calls to the search API and returns the results.
 * @param query The query to search for.
 */
async function callSearchAPI(query: string) {
  const response = await fetch(`/api/search?query=${query}`);
  const data = await response.json();
  return data;
};

/**
 * Creates the search bar component.
 * 
 * The search bar is included in the header.
 */
const SearchBar = () => {
  const search = useContext(SearchContext);
  const [results, setResults] = useState<any[]>([]);

  // Handles the search bar submission button.
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const query = event.target.search.value;

    if (query) {
      callSearchAPI(query).then((data) => {
        console.log(data)
        setResults(data);
      });
    }

    search.setQuery(query);
  };

  return (
    <form className={styles.search} onSubmit={(e) => handleSubmit(e)}>
      {/* Search Input */}
      <input
        className={styles.searchInput}
        type="text"
        name="search"
        id="search"
        placeholder="English, 日本語, Romaji..."
      />

      {/* Control Buttons */}
      <button className={styles.searchButton} type="submit">Search</button>
      <button className={styles.clearButton} type="reset">Clear</button>
      <button className={styles.searchHistoryButton} type="button">
        <FaHistory />
      </button>
    </form>
  );
};

/* --------------------------------- HEADER --------------------------------- */
/**
 * Creates the header of the page.
 * 
 * The header contains the application name, its description,
 * as well as a search bar.
 */
const Header = () => {
  return (
    <header className={styles.header}>
      {/* App Name */}
      <div className={styles.title}>{appName}</div>

      {/* App Description */}
      <div className={styles.subtitle}>
        A lighter, more compact version of the&nbsp;
        <a href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
          jisho.org
        </a>
        &nbsp;Japanese-English dictionary!
      </div>
      
      {/* Search Bar */}
      <SearchBar />
    </header>
  )
}

/* --------------------------------- FOOTER --------------------------------- */
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
        <a
          href="https://github.com/jon-chow"
          no-referrer='noreferrer'
          target='blank'
        >
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
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
const SearchContext = createContext({query: "", setQuery: (query: string) => {}});
/**
 * Exports the Home component.
 * 
 * The Home component is basically the entire page.
 */
export default function Home() {
  const [currentSearch, setCurrentSearch] = useState("");

  // Changes the colour of buttons and text based on the background image.
  const hoverHandler = (button: HTMLElement, color: string) => {
    const prev = button.style.color;
    button.onmouseover = () => { button.style.color = color; };
    button.onmouseleave = () => { button.style.color = prev; };
  };

  useEffect(() => {
    const fac = new FastAverageColor();
    fac.getColorAsync(background.image).then(color => {
      const smButtons = Array.from(document.getElementsByClassName(styles.socialMediaButton) as HTMLCollectionOf<HTMLElement>);
      const repoButton = document.getElementsByClassName(styles.repositoryButton)[0] as HTMLElement;
      
      smButtons.forEach(button => { hoverHandler(button, color.hex); });
      
      hoverHandler(repoButton, color.hex);
    }).catch(e => {
      console.log(e);
    });
  }, []);

  return (
    <div className={styles.container}>
      <SearchContext.Provider value={{ query: currentSearch, setQuery: setCurrentSearch }}>
        <MetaData />

        <Background />
        <Header />
        <main className={styles.main}>
          <div className={styles.results}>
            
          </div>
        </main>
        <Footer />
      </SearchContext.Provider>
    </div>
  );
};
