import React from 'react';

import './App.scss';

const TopHeader = () => {
  return (
    <header className='clip-header' id='header'>
      <div className='clip-header__bg' />
      <div className='clip-header__intro' data-aos='zoom-in-right'>
        <h1>The Art Museum</h1>
        <p>Built on Harvard&apos;s Art Museum robust API</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        </p>
      </div>
    </header>
  );
}

export default TopHeader;
