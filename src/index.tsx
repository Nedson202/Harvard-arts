import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import AOS from 'aos';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { RestLink } from 'apollo-link-rest';
import { ApolloProvider } from 'react-apollo';
// tslint:disable
import 'aos/dist/aos.css';
import 'antd/dist/antd.css';
// tslint:enable
import './scss/index.scss';
import * as serviceWorker from './serviceWorker';

import Routes from './routes';

AOS.init({
  duration: 2000,
});

const serverURL: string = process.env.REACT_APP_SERVER_URL || '';
const restLink = new RestLink({ uri: serverURL });

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

if ((module as any).hot) {
  (module as any).hot.accept('./routes', () => {
    renderDOM();
  });
}

serviceWorker.register();

export {
  client,
};
