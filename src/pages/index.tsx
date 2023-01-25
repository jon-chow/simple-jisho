import {  useEffect } from 'react';

import { Status, useSearch } from '../contexts/SearchProvider';

import DefaultResults from '../components/DefaultResults';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the home page.
 * 
 * The Home component is basically the entire page.
 */
const HomePage = () => {
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
