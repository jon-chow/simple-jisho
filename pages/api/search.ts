// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// /api/search?query=keyword
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  keyword: string
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query;
  const { keyword } = query;

  const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${keyword}`);
  const data = await response.json();

  res.status(200).json(data.data);
};
