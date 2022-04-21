import React from 'react';
import { Switch } from 'react-router-dom';
import Products from '~/pages/products';
import Tags from '~/pages/tags';
import Route from './Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/tags" exact component={Tags} />
      <Route path="/" component={() => <h1>404</h1>} />
    </Switch>
  );
}
