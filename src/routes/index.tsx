import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import App from '../Components/Main/App';
import Collections from '../Components/Collections';
import Collection from '../Components/Collection';
import NavBar from '../Components/Navbar';
import Publications from '../Components/Publications';
import Places from '../Components/Places';
import NotFound from '../Components/NotFound';

const Routes = () => (
  <Fragment>
    <NavBar />
    <Switch>
      <Route path='/' component={App} exact={true} />
      <Route path='/collections' component={Collections} exact={true} />
      <Route path='/collections/:id' component={Collection} exact={true} />
      <Route path='/publications' component={Publications} exact={true} />
      <Route path='/places' component={Places} exact={true} />
      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Routes;
