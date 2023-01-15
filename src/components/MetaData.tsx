import { useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    (resultsContext.keyword) ? setTitle(`${resultsContext.keyword} - ${AppInfoData.name}`)
                              : setTitle(`${AppInfoData.name}: Japanese Dictionary`);
  }, [resultsContext.keyword]);

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
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default MetaData;
