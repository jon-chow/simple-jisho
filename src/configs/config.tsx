import { FaHome, FaTable, FaStar, FaGithubSquare, FaLinkedin } from 'react-icons/fa';


/**
 * Data for information about the app.
 */
export const AppInfoData = {
  name: "Simple Jisho",
  description: 'A reformatted, simpler version of jisho.org.',
  keywords: "English, Japanese, Dictionary, Jisho",
  repository: "https://github.com/jon-chow/simple-jisho",
};

/**
 * Data for the background image.
 */
export const BackgroundData: Background = {
  image: "/static/background.png",
  artist: "Alpha Coders",
  artistLink: "https://wall.alphacoders.com/big.php?i=937175",
  overlayColor: "linear-gradient(rgb(var(--theme-background)), rgba(var(--theme-background), 0.2), rgba(var(--theme-background), 0.6))",
  blurAmount: 3,
};

/**
 * Data for the social media buttons in the footer.
 */
export const SMButtonsData: LinkButton[] = [
  { title: "GitHub",   icon: <FaGithubSquare />, link: "https://github.com/jon-chow"          },
  { title: "LinkedIn", icon: <FaLinkedin />,     link: "https://www.linkedin.com/in/ja-chow/" },
];

/**
 * Data for the tech stack section.
 */
export const TechStackData: TechStack[] = [
  { name: "SASS/SCSS",  link: "https://sass-lang.com/"          },
  { name: "Next.js",    link: "https://nextjs.org/"             },
  { name: "TypeScript", link: "https://www.typescriptlang.org/" },
];

/**
 * Data for the navigation buttons in the search bar.
 */
export const NavButtonsData: LinkButton[] = [
  { title: 'Home',       icon: <FaHome />,  link: '/'          },
  { title: 'Kana Chart', icon: <FaTable />, link: '/kana'      },
  { title: 'Bookmarks',  icon: <FaStar />,  link: '/bookmarks' },
];
