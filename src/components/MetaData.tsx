import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { ResultsContext, AppInfoData } from '../configs/config';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the head of the page.
 * 
 * The head contains metadata about the page, such as the title,
 * description (for SEO), and favicon.
 */
const MetaData = () => {
  const resultsContext = useContext(ResultsContext);
  const [title, setTitle] = useState(AppInfoData.name);

  const router = useRouter();

  useEffect(() => {
    (resultsContext.keyword && router.pathname === '/search') ?
    setTitle(`${resultsContext.keyword} - ${AppInfoData.name}`) :

    (router.pathname === '/kana') ?
    setTitle(`Kana Chart on ${AppInfoData.name}`) :

    setTitle(`${AppInfoData.name}: Japanese-English Dictionary`);
  }, [resultsContext.keyword, router.pathname]);

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={AppInfoData.description} />
      <meta name="keywords"
        content="English, Japanese, Dictionary, Jisho"
      />
      <meta name="author" content="jon-chow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/logo-192x192.png" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default MetaData;
