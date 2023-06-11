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
  overlayColor: "linear-gradient(rgb(var(--theme-background)), rgba(var(--theme-background), 0.2), rgba(var(--theme-background), 0.6))",
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

export const ThemesData : Theme[] = [
  {
    title: "light",
    // Main
    background: "220, 220, 220",
    foreground: "50, 50, 50",

    // Other shades
    textGrey: "100, 100, 100",
    textLightGrey: "150, 150, 150",
  },
  {
    title: "dark",
    background: "0, 0, 0",
    foreground: "255, 255, 255",
  }
];
