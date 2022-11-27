import { useEffect, useState, createContext, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { FastAverageColor } from 'fast-average-color';
import { FaGithub, FaGithubSquare, FaLinkedin, FaHistory } from 'react-icons/fa';

import SearchResult from './components/SearchResult';

import styles from '../styles/Home.module.scss';


/* -------------------------------------------------------------------------- */
/*                                DECLARATIONS                                */
/* -------------------------------------------------------------------------- */
const appInfo = {
  name: "Simple Jisho",
  description: 'A reformatted, simpler version of jisho.org.',
  repository: "https://github.com/jon-chow/simple-jisho",
  logo: "/logo.png",
};

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
  const resultsContext = useContext(ResultsContext);
  const [title, setTitle] = useState(appInfo.name);

  useEffect(() => {
    (resultsContext.keyword) ? setTitle(`${resultsContext.keyword} - ${appInfo.name}`)
                              : setTitle(`${appInfo.name}: Japanese Dictionary`);
  }, [resultsContext.keyword]);


  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={appInfo.description} />
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
        unoptimized={true}
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
 * Extended Promise to allow for cancellation.
 */
interface PromiseWithCancel<T> extends Promise<T> {
  cancel: () => void;
};

/**
 * Checks if an error is an AbortError.
 * @param error The error to check.
 */
const isAbortError = (error: any): error is DOMException => {
  return (error && error.name === "AbortError");
};

/**
 * Calls to the search API and returns the results.
 * @param query The query to search for.
 * @exception AbortError thrown when the search is cancelled.
 */
const getSearchResults = (query: string) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = new Promise(async (resolve) => {
    try {
      const response = await fetch(`/api/search?keyword=${query.toLowerCase()}`, {
        method: 'GET',
        signal
      });
      const data = await response.json();
      resolve(data);
    } catch (exception: unknown) {
      if (isAbortError(exception))
        throw exception;
    };
  });

  (promise as PromiseWithCancel<any>).cancel = () => controller.abort();

  return promise as PromiseWithCancel<any>;
};

/**
 * Retrieves the value of the query parameter with the given key.
 * @param variable Key variable to look for in the URL.
 * @returns The value of the key variable in the URL.
 */
const getQueryVariable = (variable: string) => {
  const vars = window.location.search.substring(1).split('&');

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable)
      return decodeURIComponent(pair[1]);
  };
};

/**
 * Creates the search bar component.
 * 
 * The search bar is included in the header.
 */
const SearchBar = () => {
  const searchContext = useContext(SearchContext);
  const resultsContext = useContext(ResultsContext);
  const [querying, setQuerying] = useState<PromiseWithCancel<any> | undefined>(undefined);

  const cancelQuery = () => {
    querying?.cancel();
    searchContext.setStatus(Status.CANCELLED);
  };

  /**
   * Runs a dictionary search for the given query term.
   * @param query The query to search for.
   * @param addHistory Whether to add the search to the browser history.
   */
  const search = async (query: string, addHistory: boolean = true) => {
    // Check if query is not empty.
    if (query) {
      cancelQuery();
      const q = getSearchResults(query);
      setQuerying(q);
      searchContext.setStatus(Status.LOADING);

      q.then((data) => {
        resultsContext.setKeyword(query);
        resultsContext.setResults(data);
        searchContext.setStatus(Status.SUCCESS);
        (addHistory) && window.history.pushState(null, "", (query) ? "?q=" + query : "");
      }).catch((error) => {
        console.error(error);
        searchContext.setStatus(Status.ERROR);
      });
    };

    searchContext.setQuery(query);
  };

  // Handles the search bar submission button.
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const query = event.target.search.value;
    search(query);
  };

  // Automatically searches for the query parameter in the URL.
  useEffect(() => {
    const handlePopState = () => {
      const keyword = getQueryVariable("q");
      (keyword) && search(keyword, false);
    };

    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);


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
  const searchContext = useContext(SearchContext);
  const resultsContext = useContext(ResultsContext);

  /**
   * Checks the query status and updates the status label.
   */
  const checkStatus = () => {
    switch (searchContext.status) {
      case Status.IDLE:
        return <div className={styles.statusLabel}>Look up a word by entering it into the search bar.</div>;
      case Status.LOADING:
        return <div className={styles.statusLabel}>Searching...</div>;
      case Status.SUCCESS:
        return <div className={styles.statusLabel}>
          Found {resultsContext.results.length} results for
          &quot;<span className={styles.keyword}>{resultsContext.keyword}</span>&quot;.
        </div>;
      case Status.CANCELLED:
        return <div className={styles.statusLabel}>Search cancelled.</div>;
      default:
        return <div className={styles.statusLabel}>An error occurred while searching.</div>;
    }
  };


  return (
    <header className={styles.header}>
      {/* App Name */}
      <div className={styles.title}>
        <a className={styles.logo} href={appInfo.repository} no-referrer='noreferrer' target='blank'>
          <Image
            src={appInfo.logo}
            alt="Logo"
            title={appInfo.name}
            width={40}
            height={40}
          />
        </a>
        {appInfo.name}
      </div>

      {/* App Description */}
      <div className={styles.subtitle}>
        A lighter, more compact version of the&nbsp;
        <a className={styles.underlinedLink} href="https://jisho.org/" no-referrer='noreferrer' target='blank'>
          jisho.org
        </a>
        &nbsp;Japanese-English dictionary!
      </div>
      
      {/* Search Bar */}
      <SearchBar />

      { checkStatus() }
    </header>
  )
};

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
        &copy; {new Date().getFullYear()} jon-chow.
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
        <a
          href="https://jisho.org/"
          no-referrer='noreferrer'
          target='blank'
          className={styles.underlinedLink}
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
          className={styles.underlinedLink}>
          SASS/SCSS
        </a>,&nbsp;
        <a href="https://nextjs.org/" no-referrer='noreferrer' target='blank'
          className={styles.underlinedLink}>
          Next.js
        </a>, and&nbsp;
        <a href="https://www.typescriptlang.org/" no-referrer='noreferrer' target='blank'
          className={styles.underlinedLink}>
          TypeScript
        </a>,
      </div>

      {/* Credits to background artist (if exists) */}
      {(background.artist != "") &&
        <div>
          Background wallpaper obtained from&nbsp;
          <a
            href={background.artistLink}
            no-referrer='noreferrer'
            target='blank'
            className={styles.underlinedLink}
          >
            {background.artist}
          </a>.
        </div>
      }

      {/* Link to GitHub repository */}
      <div className={styles.repository}>
        <a
          className={styles.repositoryButton}
          href={appInfo.repository}
          title={appInfo.name + " on GitHub"}
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
/**
 * Enumerates the different states of a search.
 */
enum Status { IDLE, LOADING, SUCCESS, CANCELLED, ERROR };

/**
 * Context for a search.
 */
const SearchContext = createContext({
  query: "", setQuery: (query: string) => {},
  status: Status.IDLE, setStatus: (status: Status) => {},
});

/**
 * Context for the result of a search.
 */
const ResultsContext = createContext({
  keyword: "", setKeyword: (keyword: string) => {},
  results: [ {} ], setResults: (results: any[]) => {}
});

/**
 * Type definition for an instance of a past search.
 */
type History = {
  keyword: string,
  results: any[],
  date: Date
};

/**
 * Exports the Home component.
 * 
 * The Home component is basically the entire page.
 */
export default function Home() {
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState<Status>(Status.IDLE);

  const [resultKeyword, setResultKeyword] = useState("");
  const [results, setResults] = useState<any[]>([ {} ]);

  const [history, setHistory] = useState<History[]>([  ]);

  // Changes the colour of buttons and text based on the background image.
  const hoverHandler = (button: HTMLElement, color: string) => {
    const prev = button.style.color;
    button.onmouseover = () => { button.style.color = color; };
    button.onmouseleave = () => { button.style.color = prev; };
  };

  // Changes the colour of underlined text based on the background image.
  const hoverLinkHandler = (button: HTMLElement, color: string) => {
    const prev = button.style.textDecorationColor;
    button.onmouseover = () => { button.style.textDecorationColor = color; };
    button.onmouseleave = () => { button.style.textDecorationColor = prev; };
  };

  // Changes the colour of elements based on the background image.
  useEffect(() => {
    const fac = new FastAverageColor();
    fac.getColorAsync(background.image).then(color => {
      let colorString = color.hex || "#fff";
      
      const smButtons =
        Array.from(document.getElementsByClassName(styles.socialMediaButton) as HTMLCollectionOf<HTMLElement>);
      const repoButton =
        document.getElementsByClassName(styles.repositoryButton)[0] as HTMLElement;
      const underlinedLinks =
        Array.from(document.getElementsByClassName(styles.underlinedLink) as HTMLCollectionOf<HTMLElement>);
      
      smButtons.forEach(button => { hoverHandler(button, colorString); });
      hoverHandler(repoButton, colorString);
      underlinedLinks.forEach(link => { hoverLinkHandler(link, colorString); });
    }).catch(e => {
      console.log(e);
    });
  }, []);

  
  return (
    <div className={styles.container}>
      <SearchContext.Provider value={{
        query: currentSearch, setQuery: setCurrentSearch,
        status: searchStatus, setStatus: setSearchStatus
      }}>
        <ResultsContext.Provider value={{
          results: results, setResults: setResults,
          keyword: resultKeyword, setKeyword: setResultKeyword
        }}>
          <MetaData />

          <Background />
          <Header />
          <main className={styles.main}>
            <div className={styles.results}>
              { (results.length > 0 && searchStatus == Status.SUCCESS) ? 
                results.map((result, index) => {
                  return (
                    <SearchResult key={index} results={result} />
                  )
                }) : <></> }
            </div>
          </main>
          <Footer />
        </ ResultsContext.Provider>
      </SearchContext.Provider>
    </div>
  );
};
