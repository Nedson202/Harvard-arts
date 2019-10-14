import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import AOS from 'aos';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// tslint:disable
import 'aos/dist/aos.css';
import 'antd/dist/antd.css';
// tslint:enable
import './index.scss';
import { RestLink } from 'apollo-link-rest';
import * as serviceWorker from './serviceWorker';

import Routes from './routes';

AOS.init({
  duration: 2000,
});

const restLink = new RestLink({ uri: 'http://localhost:4000/harvard-arts/' });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const renderDOM = () => {
  render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  );
};

renderDOM();

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderDOM();
  });
}

serviceWorker.unregister();

export {
  client,
};
