import React from 'react';
import ReactDOM from 'react-dom';
// import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import { createClient } from './graphql/schema';

import './index.css';


// createClient().then(client => {
  ReactDOM.render(
    (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    ),
    document.getElementById('root'),
  );
  registerServiceWorker();
// })
