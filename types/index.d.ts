/* -------------------------------------------------------------------------- */
/*                                   MODULES                                  */
/* -------------------------------------------------------------------------- */

// Module declaration for SVG files.
declare module "*.svg" {
  const content: any;
  export default content;
}

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

// Type definition for a background image.
type Background = {
  image: string,
  artist: string,
  artistLink: string,
  overlayColor: string,
  blurAmount: number,
};

// Type definition for a social media button.
type SMButton = {
  title: string,
  icon: JSX.Element, 
  link: string,
};

// Type definition for a tech stack item.
type TechStack = {
  name: string,
  link: string,
}

// Type definition for an instance of a past search.
type SearchHistory = {
  keyword: string,
  date: Date,
  results: WordData[],
};

// Type definition for a word's sense.
type Sense = {
  english_definitions: string[],
  parts_of_speech: string[],
  links: {
    text: string,
    url: string,
  }[],
  tags: string[],
  restrictions: string[],
  see_also: string[],
  antonyms: string[],
  source: string[],
  info: string[],
};

// Type definition for a word.
type WordData = {
  slug: string,
  is_common: boolean,
  kanji: string[],
  jlpt: string[],
  japanese: string[],
  senses: Sense[],
  sentences: {
    english: string,
    kana: string,
    kanji: string,
    pieces: string,
  }[],
};
