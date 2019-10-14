import React, { Component } from 'react';
import TopHeader from './TopHeader';
import { artBowl, putto, carved, manotation,
  lovejoy, colors, technic, gallery } from '../../assets';
import { navBarElement, customNavElement, horizontalScrollDistance } from '../../utils';

let imageToggleCount = 1;

class App extends Component {
  public componentDidMount() {
    window.addEventListener('scroll', this.toggleNav);
  }

  public componentWillUnmount() {
    const navBar = document.getElementById(navBarElement);

    window.removeEventListener('scroll', this.toggleNav);

    if (navBar) {
      navBar.classList.remove(customNavElement);
    }
  }

  public toggleNav = () => {
    const { scrollY } = window;
    const navBar = document.getElementById(navBarElement);
    if (scrollY > horizontalScrollDistance) {
      return navBar && navBar.classList.remove(customNavElement);
    }
  
    return navBar && navBar.classList.add(customNavElement);
  }

  public toggleImageStack = (element: string) => () => {
    imageToggleCount += 1;
    const htmlData = document.getElementById(element);
    if (htmlData) {
      htmlData.style.zIndex = `${imageToggleCount}`;
    }
  }

  public returnVoid = () => 0;

  public render() {
    return (
      <div className='app-layout'>
        <TopHeader />
        <div className='app-layout__data'>
          <h1 className='header-tag center'>Collections & Annotations</h1>
          <div data-aos='fade-right' className='app-layout__data-collection'>
            <span className='images'>
              <img
                id='first-img'
                src={artBowl}
                alt='art-bowl'
                onMouseOver={this.toggleImageStack('first-img')}
              />
              <img
                className='second-img'
                id='second-img'
                src={putto}
                onMouseOver={this.toggleImageStack('second-img')}
                alt='putto'
                onFocus={this.returnVoid}
              />
              <img
                className='third-img'
                id='third-img'
                src={carved}
                alt='putto'
                onMouseOver={this.toggleImageStack('third-img')}
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
          <div data-aos='zoom-out-up' className='app-layout__data-annotation'>
            <div className='images'>
              <img
                src={lovejoy}
                alt='lovejoy'
                id='lovejoy-img'
                onMouseOver={this.toggleImageStack('lovejoy-img')}
                onFocus={this.returnVoid}
              />
              <img
                className='second-img'
                src={manotation}
                alt='manotation'
                id='manotation'
                onMouseOver={this.toggleImageStack('manotation')}
                onFocus={this.returnVoid}
              />
            </div>
            <div className='description'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
          <div className='app-layout__data-methods'>
            <h1 className='header-tag center'>Explore</h1>
            <div className='services center'>
              <div data-aos='zoom-in-down'>
                <img src={colors} alt='color-display' />
                <h2>Colors</h2>
                <p>
                  You information on the colors used to describe items in the Harvard
                  Art Museums collections.
                </p>
              </div>
              <div data-aos='zoom-in-up'>
                <img src={technic} alt='color-display' />
                <h2>Technique</h2>
                <p>
                  Get information on the techniques used in the production of items in
                  the Harvard Art Museums
                </p>
              </div>
              <div data-aos='zoom-in-down'>
                <img src={gallery} alt='color-display' />
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
      </div>
    );
  }
}

export default App;
