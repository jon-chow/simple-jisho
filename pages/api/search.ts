// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// /api/search?query=keyword
import type { NextApiRequest, NextApiResponse } from 'next';

type Sense = {
  english_definitions: string[],
  parts_of_speech: string[],
  links: {
    text: string,
    url: string
  }[],
  tags: string[],
  restrictions: string[],
  see_also: string[],
  antonyms: string[],
  source: string[],
  info: string[],
}

type WordData = {
  slug: string,
  is_common: boolean,
  jlpt: string[],
  japanese: string[],
  senses: Sense[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { keyword } = req.query;

  const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${keyword}`);
  const data = await response.json();
  
  const filteredData = data.data.map((item: WordData) => {
    return {
      slug: item.slug,
      is_common: item.is_common,
      jlpt: item.jlpt,
      japanese: item.japanese,
      senses: item.senses,
    };
  });

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).json(filteredData);
};
