/* -------------------------------------------------------------------------- */
/*                                   MODULES                                  */
/* -------------------------------------------------------------------------- */

// Module declaration for SVG files.
declare module "*.svg" {
  const content: any;
  export default content;
}

/* -------------------------------------------------------------------------- */
/*                                API PROMISES                                */
/* -------------------------------------------------------------------------- */

/**
 * Extended Promise to allow for cancellation.
 */ 
interface PromiseWithCancel<T> extends Promise<T> {
  cancel: () => void;
};

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
  icon: React.ReactElement, 
  link: string,
};

// Type definition for a tech stack item.
type TechStack = {
  name: string,
  link: string,
}

// Type definition for a version.
type Version = {
  version: {
    major: number,
    minor: number,
    patch: number,
  },
  date: Date,
  changes: string[],
};

// Type definition for a notification message.
type MessageProps = {
  id: string;
  type?: MessageType;
  title: string;
  message: string | React.ReactNode;
  timestamp: number;
  duration?: number;
};

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

// Type definition for a word's kanji.
type Kana = {
  romaji: string,
  hiragana: string,
  katakana: string,
};

// Type definition for a drop down option.
type Option = {
  title : string;
  value : string;
};
