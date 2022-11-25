// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { keyword } = req.query;
  const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${keyword}`,
      {
        mode: 'no-cors',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  const data = await response.json();

  res.status(200).json(data);
};
