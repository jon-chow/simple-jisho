import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';

import { Status, ResultsContext, SearchContext, SearchHistoryContext, BackgroundData } from '../configs/config';

import MetaData from '../components/MetaData';
import Background from '../components/Background';
import Header from '../components/Header';
import DefaultResults from '../components/DefaultResults';
import SearchResult from '../components/SearchResult';
import Footer from '../components/Footer';

import styles from '../styles/Home.module.scss';
import styles2 from '../styles/Footer.module.scss';
import SearchHistoryModal from '../components/SearchHistoryModal';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the Home component.
 * 
 * The Home component is basically the entire page.
 */
const Home = () => {
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState<Status>(Status.IDLE);

  const [resultKeyword, setResultKeyword] = useState("");
  const [results, setResults] = useState<any[]>([{}]);

  const [modalToggle, setModalToggle] = useState(false);

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

    fac.getColorAsync(BackgroundData.image).then(color => {
      let colorString = color.hex || "#fff";
      
      const smButtons =
        Array.from(document.getElementsByClassName(styles2.SocialMediaButton) as HTMLCollectionOf<HTMLElement>);
      const repoButton =
        document.getElementsByClassName(styles2.RepositoryButton)[0] as HTMLElement;
      const underlinedLinks =
        Array.from(document.getElementsByClassName(styles.UnderlinedLink) as HTMLCollectionOf<HTMLElement>);
      
      smButtons.forEach(button => { hoverHandler(button, colorString); });
      hoverHandler(repoButton, colorString);
      underlinedLinks.forEach(link => { hoverLinkHandler(link, colorString); });
    }).catch(e => {
      console.log(e);
    });
  }, []);

  return (
    <SearchContext.Provider value={{
      query: currentSearch, setQuery: setCurrentSearch,
      status: searchStatus, setStatus: setSearchStatus
    }}>
      <ResultsContext.Provider value={{
        results: results, setResults: setResults,
        keyword: resultKeyword, setKeyword: setResultKeyword
      }}>
        <SearchHistoryContext.Provider value={{
          modalToggle: modalToggle, setModalToggle: setModalToggle
        }}>
          <div className={styles.Container}>
            <MetaData />
            <Background />
            <Header />

            {/* Search History Modal */}
            { modalToggle && <SearchHistoryModal /> }

            <main className={styles.Main}>
              { ((results.length > 0 && searchStatus === Status.SUCCESS)) ? 
                results.map((result, index) => {
                  return (
                    <SearchResult key={index} resultData={result} />
                  )
                }) : <DefaultResults /> }
            </main>

            <Footer />
          </div>
        </SearchHistoryContext.Provider>
      </ResultsContext.Provider>
    </SearchContext.Provider>
  );
};

export default Home;
