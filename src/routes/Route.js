import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Layout from '~/pages/_layout';

export default function RouterWrapper({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouterWrapper.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};
