import {  useEffect } from 'react';

import { useSearch, Status } from '@src/contexts/SearchProvider';

import DefaultResults from '@src/components/DefaultResults';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Exports the home page. \
 * The Home component is basically the entire page.
 * @returns The home page.
 */
const HomePage = (): JSX.Element => {
  const { setStatus } = useSearch();

  // Reset search status to idle.
  useEffect(() => {
    setStatus(Status.IDLE);
  }, []);

  return (
    <DefaultResults />
  );
};

export default HomePage;
