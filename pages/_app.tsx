import type { AppProps } from 'next/app';

import '../styles/_globals.scss';


const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
};

export default App;
