import { createContext } from "react";
import { FaGithubSquare, FaLinkedin } from 'react-icons/fa';

export const AppInfoData = {
  name: "Simple Jisho",
  description: 'A reformatted, simpler version of jisho.org.',
  repository: "https://github.com/jon-chow/simple-jisho",
  logo: "/static/logo.png",
};

export const BackgroundData : Background = {
  image: "/static/background.jpg",
  artist: "Alpha Coders",
  artistLink: "https://wall.alphacoders.com/big.php?i=496311",
};

export const SMButtonsData : SMButton[] = [
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

export const TechStackData : TechStack[] = [
  {
    name: "SASS/SCSS",
    link: "https://sass-lang.com/"
  },
  {
    name: "Next.js",
    link: "https://nextjs.org/"
  },
  {
    name: "TypeScript",
    link: "https://www.typescriptlang.org/"
  },
];


// Enumerates the different states of a search.
export enum Status {
  IDLE,
  LOADING,
  SUCCESS,
  CANCELLED,
  ERROR
};

// Context for a search.
export const SearchContext = createContext({
  query: "",
  setQuery: (query: string) => {},
  status: Status.IDLE,
  setStatus: (status: Status) => {},
});

// Context for search history.
export const SearchHistoryContext = createContext({
  modalToggle: false,
  setModalToggle: (modalToggle: boolean) => {},
});

// Context for the result of a search.
export const ResultsContext = createContext({
  keyword: "",
  setKeyword: (keyword: string) => {},
  results: [{}],
  setResults: (results: any[]) => {},
});
