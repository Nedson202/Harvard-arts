import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import Collection from '../Components/Collection';
import Collections from '../Components/Collections';

import Base from '../Components/Base';
import NavBar from '../Components/Navbar';
import NotFound from '../Components/NotFound';
import Places from '../Components/Places';
import Publications from '../Components/Publications';

const Routes = () => (
  <Fragment>
    <NavBar />
    <Switch>
      <Route path='/' component={Base} exact={true} />
      <Route path='/collections' component={Collections} exact={true} />
      <Route path='/collections/:id' component={Collection} exact={true} />
      <Route path='/publications' component={Publications} exact={true} />
      <Route path='/places' component={Places} exact={true} />
      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Routes;
