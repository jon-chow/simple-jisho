// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// /api/search?query=keyword
import type { NextApiRequest, NextApiResponse } from 'next';


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
