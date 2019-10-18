import React from 'react';

import './NotFound.scss';

const NotFound = () => (
  <div className='container-content'>
    <div className='not-found'>
      <h1 className='not-found__404'>404!</h1>
      <h1 className='not-found__text'>
        Sorry this page does not exist.
      </h1>
    </div>
  </div>
);

export default NotFound;
