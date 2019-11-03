import React, { Component } from 'react';

import TopHeader from './TopHeader';

import {
  allCollections, allPublication, colors, gallery, technic,
} from '../../assets';

import {
  CUSTOM_NAV_ELEMENT, HORIZONTAL_SCROLL_DISTANCE, NAV_BAR_ELEMENT, SCROLL,
} from '../../settings';
import BackToTop from '../BackToTop';

class App extends Component {
  public componentDidMount() {
    window.addEventListener(SCROLL, this.toggleNav);
  }

  public componentWillUnmount() {
    const navBar = document.getElementById(NAV_BAR_ELEMENT);

    window.removeEventListener(SCROLL, this.toggleNav);

    if (navBar) {
      navBar.classList.remove(CUSTOM_NAV_ELEMENT);
    }
  }

  public toggleNav = () => {
    const { scrollY } = window;
    const navBar = document.getElementById(NAV_BAR_ELEMENT);

    if (scrollY > HORIZONTAL_SCROLL_DISTANCE) {
      return navBar && navBar.classList.remove(CUSTOM_NAV_ELEMENT);
    }

    return navBar && navBar.classList.add(CUSTOM_NAV_ELEMENT);
  }

  public returnVoid = () => 0;

  public render() {
    return (
      <div className='app-layout'>
        <TopHeader />

        <div className='app-layout__data'>
          <h1 className='app-layout__data--header center'>Collections &amp; Publications</h1>
          <div className='app-layout__data-collection-publication'>
            <div data-aos='fade-right' className='app-layout__data-collection'>
              <span className='images'>
                <img
                  className='second-img'
                  src={allCollections}
                  alt='all collections screen'
                  onFocus={this.returnVoid}
                />
              </span>
              <div className='description'>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
            <div data-aos='zoom-out-up' className='app-layout__data-publication'>
              <span className='images'>
                <img
                  src={allPublication}
                  alt='all publications screen'
                  onFocus={this.returnVoid}
                />
              </span>
              <div className='description'>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
          <div className='app-layout__data-methods'>
            <h1 className='app-layout__data--header center'>Explore</h1>
            <div className='services center'>
              <div data-aos='zoom-in-down'>
                <img src={colors} alt='color-display' />
                <h2>Colors</h2>
                <p>
                  You get information on the colors used to describe items in the Harvard
                  Art Museums collections.
                </p>
              </div>
              <div data-aos='zoom-in-up'>
                <img src={technic} alt='technique-display' />
                <h2>Technique</h2>
                <p>
                  Get information on the techniques used in the production of items in
                  the Harvard Art Museums
                </p>
              </div>
              <div data-aos='zoom-in-down'>
                <img src={gallery} alt='gallery-display' />
                <h2>Gallery</h2>
                <p>
                  Access to information on physical spaces within the museums’ building at
                  {' '}
                  <a
                    href='https://www.google.com/maps/place/Harvard+Art+Museums/@42.3742591,-71.1136073,19z/data=!4m2!3m1!1s0x0:0x3ea24d53829c6322'
                  >
                    32 Quincy Street, Cambridge, MA
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <BackToTop />
      </div>
    );
  }
}

export default App;
