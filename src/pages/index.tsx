import { useContext, useEffect } from 'react';

import { Status, SearchContext } from '../configs/config';

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
  const { setStatus } = useContext(SearchContext);

  // Reset search status to idle.
  useEffect(() => {
    setStatus(Status.IDLE);
  }, []);

  return (
    <DefaultResults />
  );
};

export default HomePage;
