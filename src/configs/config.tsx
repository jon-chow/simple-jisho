import { createContext } from "react";
import { FaGithubSquare, FaLinkedin } from 'react-icons/fa';

export const AppInfoData = {
  name: "Simple Jisho",
  description: 'A reformatted, simpler version of jisho.org.',
  repository: "https://github.com/jon-chow/simple-jisho",
};

export const BackgroundData : Background = {
  image: "/static/background.png",
  artist: "Alpha Coders",
  artistLink: "https://wall.alphacoders.com/big.php?i=937175",
  overlayColor: "linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))",
  blurAmount: 3,
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
  { name: "SASS/SCSS",  link: "https://sass-lang.com/"          },
  { name: "Next.js",    link: "https://nextjs.org/"             },
  { name: "TypeScript", link: "https://www.typescriptlang.org/" },
];

export const VersionData : Version[] = [
  // {
  //   version: "",
  //   date: new Date(""),
  //   changes: [
  //     "",
  //   ],
  // },
  {
    version: "1.3.0",
    date: new Date("Jan. 19, 2023"),
    changes: [
      "Added a modal for displaying developer logs.",
      "Created a new page for displaying kana.",
      "Added a modal for displaying kana stroke order.",
      "Improved routing for the app.",
    ],
  },
  {
    version: "1.2.0",
    date: new Date("Jan. 15, 2023"),
    changes: [
      "Added copying functionality for search results.",
      "Added a modal for displaying kanji information.",
      "Kanji information displays the kanji, its meaning, its on and kun readings, and stroke order.",
      "Included example sentences to search results.",
      "Improved the UI for displaying search results.",
      "Fixed a bug where the browser history would not update.",
      "Fixed a bug in pagination where changing pages would not scroll to the top of the page.",
    ],
  },
  {
    version: "1.1.0",
    date: new Date("Jan. 13, 2023"),
    changes: [
      "Inplemented search history functionality.",
      "Added a modal for displaying search history.",
      "Implemented pagination.",
    ],
  },
  {
    version: "1.0.0",
    date: new Date("Dec. 9, 2022"),
    changes: [
      "Initial release.",
      "Included search and clear functionality.",
    ],
  }
];

// Enumerates the different states of a search.
export enum Status {
  IDLE,
  LOADING,
  SUCCESS,
  CANCELLED,
  ERROR
};

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

// Context for a search.
export const SearchContext = createContext({
  query: "",
  setQuery: (query: string) => {},
  status: Status.IDLE,
  setStatus: (status: Status) => {},
});

// Context for the result of a search.
export const ResultsContext = createContext({
  keyword: "",
  setKeyword: (keyword: string) => {},
  results: [] as WordData[],
  setResults: (results: WordData[]) => {},
});


/* --------------------------------- MODALS --------------------------------- */


// Enumerates the different types of modals.
export enum ModalType {
  NONE,
  DEVLOGS,
  SEARCH_HISTORY,
  KANJI,
  KANA,
};

// Base context for a modal.
const Modal = {
  modalType: ModalType.NONE,
  setModalType: (modalType: ModalType) => {},
  modalToggle: false,
  setModalToggle: (modalToggle: boolean) => {},
  data: {} as any,
  setData: (data: any) => {},
};

// Context for modal.
export const ModalContext = createContext(Modal);

// Resets the modal context.
export const resetModalContext = (context : typeof Modal) => {
  context.setModalType(ModalType.NONE);
  context.setModalToggle(false);
  context.setData({});
};
