import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useResults } from '@src/contexts/ResultsProvider';

import { AppInfoData } from '../configs/config';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the head element of the page. \
 * The head contains metadata about the page, such as the title,
 * description (for SEO), and favicon.
 * @return The head element of the page.
 */
const MetaData = (): JSX.Element => {
  const resultsContext = useResults();
  const [title, setTitle] = useState(AppInfoData.name);

  const router = useRouter();

  // The title given to each page.
  const ROUTE_TITLES: { path?: string, title: string}[] = [
    { path: '/', title: `${AppInfoData.name}: Japanese-English Dictionary` },
    { path: '/search', title: `${resultsContext.keyword} - ${AppInfoData.name}` },
    { path: '/kana', title: `Kana Chart on ${AppInfoData.name}` },
    { path: '/bookmarks', title: `Saved Terms on ${AppInfoData.name}` },
    { title: `404 - Page Not Found! ${AppInfoData.name}` }
  ];

  // Sets the title of the page.
  useEffect(() => {
    const routeTitle = ROUTE_TITLES.find(route => route.path === router.pathname);
    (routeTitle) ?
      setTitle(routeTitle.title) :
      setTitle(ROUTE_TITLES[ROUTE_TITLES.length - 1].title); // 404 page
  }, [resultsContext.keyword, router.pathname]);

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={AppInfoData.description} />
      <meta name="keywords" content={AppInfoData.keywords} />
      <meta name="author" content="jon-chow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/logo-192x192.png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </Head>
  );
};

export default MetaData;
