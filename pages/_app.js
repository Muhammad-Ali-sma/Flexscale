import { PersistGate } from 'redux-persist/integration/react';
import CssBaseline from '@mui/material/CssBaseline';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import theme from '../utils/theme';
import Head from 'next/head';
import '../style/css/style.css';
import RouteGuard from '../utils/RouteGuard';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '../utils/createEmotionCache';
import { QueryClientProvider, QueryClient } from 'react-query';

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouteGuard>
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            </RouteGuard>
          </ThemeProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  )
}

export default App;
