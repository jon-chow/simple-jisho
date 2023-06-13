/*
 * Next.js API route support: https://nextjs.org/docs/api-routes/introduction
 *
 * Legacy: used the official Jisho API.
 * const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${keyword}`);
 * const data = await response.json();
 */

import type { NextApiRequest, NextApiResponse } from 'next';

import JishoAPI from "./jishoAPI";


const jisho = new JishoAPI();

/* -------------------------------------------------------------------------- */
/*                                  FUNCTION                                  */
/* -------------------------------------------------------------------------- */

/**
 * Handles the search API route. \
 * Responds with a list of definitions, examples, and kanji for the given keyword.
 * @path /api/search
 * @param req The request object.
 * @param res The response object.
 * @returns A list of definitions, examples, and kanji for the given keyword.
 * @async
 */
async function handler(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
  const { keyword, page, maxSearch, maxSentence } = req.query as {
		keyword: string;
		page: string;
		maxSearch: string;
		maxSentence: string;
	};

  const phrasesData = await jisho.searchForPhrase(keyword, page);

  // Filters out the data we don't need in phrasesData.
  const filteredPhrasesData = phrasesData.data.slice(0, parseInt(maxSearch) || 20).map((item: any): WordData => {
    return {
      slug: item.slug,
      is_common: item.is_common,
      jlpt: item.jlpt,
      japanese: item.japanese,
      senses: item.senses,
      sentences: [],
    };
  });

  // Fetches the examples for each phrase.
  const examplesPromises = filteredPhrasesData.map(async (phrase: any) => {
    const wordData = await jisho.searchForExamples(phrase.slug)
    const trimmedData = wordData.results.slice(0, parseInt(maxSentence) || 5);

    const filteredData = trimmedData.map((item: any): Sentence => {
			return {
				english: item.english,
				kana: item.kana,
				kanji: item.kanji,
			};
		});
    
    phrase.sentences = filteredData;
  });
  await Promise.all(examplesPromises);

  // Fetches the kanji for each phrase.
  const kanjiPromises = filteredPhrasesData.map(async (phrase: any) => {
    const separatedKanji = phrase.slug.split('');
    const kanji = separatedKanji.filter((char: string) => {
      return char.match(/[\u3400-\u9FBF]/);
    });

    const kanjiData = kanji.map(async (kanji: string) => {
      const kanjiData = await jisho.searchForKanji(kanji);
      return kanjiData;
    });
    
    phrase.kanji = await Promise.all(kanjiData);
  });
  await Promise.all(kanjiPromises);

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).json(filteredPhrasesData);
};

export default handler;
