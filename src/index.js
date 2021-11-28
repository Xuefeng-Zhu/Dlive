import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MoralisProvider } from 'react-moralis';

import './index.css';
import App from './App';
import { StateContextProvider } from './contexts/StateContextProvider';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_API_ID}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER}
    >
      <StateContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StateContextProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
