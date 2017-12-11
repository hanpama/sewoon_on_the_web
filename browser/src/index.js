import React from 'react';
import ReactDOM from 'react-dom';
// import { ApolloProvider } from 'react-apollo';
import { HashRouter } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import { createClient } from './graphql/schema';

import './index.css';


// createClient().then(client => {
  ReactDOM.render(
    (
      <HashRouter>
        <App />
      </HashRouter>
    ),
    document.getElementById('root'),
  );
  registerServiceWorker();
// })
