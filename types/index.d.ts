/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

// Type definition for a background image.
type Background = {
  image: string,
  artist: string,
  artistLink: string,
};

// Type definition for a social media button.
type SMButton = {
  title: string,
  icon: JSX.Element, 
  link: string,
};

// Type definition for an instance of a past search.
type SearchHistory = {
  keyword: string,
  results: any[],
  date: Date,
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
  jlpt: string[],
  japanese: string[],
  senses: Sense[],
};
