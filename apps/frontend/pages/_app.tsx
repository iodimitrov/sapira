import '~/styles/globals.scss';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { CssBaseline, StylesProvider, ThemeProvider } from '@material-ui/core';
import theme from '../theme';
import { SWRConfig } from 'swr';
import gqlClient from '../client';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StylesProvider injectFirst>
          <SWRConfig
            value={{
              fetcher: ([query, variables]: [string, any]) =>
                gqlClient.request(query, variables),
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
        </StylesProvider>
      </ThemeProvider>
    </>
  );
}
