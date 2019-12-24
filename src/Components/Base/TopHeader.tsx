import React from 'react';

import './Base.scss';

const TopHeader = () => {
  return (
    <header className='clip-header' id='header'>
      <div className='clip-header__bg' />
      <div className='clip-header__intro' data-aos='zoom-in-right'>
        <h1>The Art Museum</h1>
        <p>
          Built on Harvard&apos;s Art Museum robust &nbsp;
          <a href='https://www.harvardartmuseums.org' className='api-directory'>API</a>.
        </p>
        <p>
          Here to offer you a different look and feel of art collections and publications
          from the Harvard Art Museum archives.
          <br />
          <br />
          The Places page also leverages the places API related to collections in the Art
          Archives to deliver you a graphical view of these data using the Google Maps API.
        </p>
      </div>
    </header>
  );
};

export default TopHeader;
