import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';

import Search from '../Search';
import {
  ROOT_PATH, PLACES_PATH, NAV_BAR_ELEMENT, NO_DISPLAY,
  NAV_BAR_BOX_SHADOW, MINIMUM_SCROLL_DISTANCE, MAXIMUM_SCROLL_DISTANCE,
  CUSTOM_NAV_ELEMENT, SCROLL, CLICK,
} from '../../settings';
import { INavbarState } from '../../../types';
import SideNav from '../SideNav';

class NavBar extends Component<any, INavbarState> {
  public state = {
    isSideNavOpen: false,
  };

  public node: any;

  public componentDidMount() {
    window.addEventListener(SCROLL, this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  public componentWillUnmount() {
    window.addEventListener(SCROLL, this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  public toggleMobileNav = () => {
    const { isSideNavOpen } = this.state;

    if (typeof window.orientation === 'undefined') {
      return;
    }

    if (!isSideNavOpen) {
      document.addEventListener(CLICK, this.handleOutsideClick, false);
    } else {
      document.removeEventListener(CLICK, this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      isSideNavOpen: !prevState.isSideNavOpen,
    }));
  }

  public handleOutsideClick = (event: any) => {
    if (this.node.contains(event.target)) {
      return;
    }

    this.toggleMobileNav();
  }

  public handlePageScroll = () => {
    const pathName = window.location.pathname;
    const lowerScrollPosition = document.body.scrollTop < MINIMUM_SCROLL_DISTANCE
      || document.documentElement.scrollTop < MAXIMUM_SCROLL_DISTANCE;

    const navbar = document.getElementById(NAV_BAR_ELEMENT);

    if (!navbar) {
      return;
    }

    if (pathName !== PLACES_PATH && lowerScrollPosition) {
      navbar.style.boxShadow = NO_DISPLAY;
    }

    if (
      document.body.scrollTop > MINIMUM_SCROLL_DISTANCE
      || document.documentElement.scrollTop > MINIMUM_SCROLL_DISTANCE
    ) {
      navbar.style.boxShadow = NAV_BAR_BOX_SHADOW;
    }
  }

  public render() {
    const { isSideNavOpen } = this.state;
    const pathName = window.location.pathname;
    const styleName = pathName === ROOT_PATH && CUSTOM_NAV_ELEMENT;

    return (
      <Fragment>
        {isSideNavOpen && <SideNav />}

        <div
          className={`${'clip-header__nav'} ${styleName}`}
          id='nav-bar'
          ref={(node) => { this.node = node; }}
        >
          <h1 className='clip-header__nav-logo'>
            <NavLink to='/'>Art Museum</NavLink>
          </h1>
          <div>
            <Search />
          </div>
          <div className='clip-header__menu'>
            <span>
              <NavLink to='/collections'>
                Collections
              </NavLink>
            </span>
            <span>
              <NavLink to='/publications'>Publications</NavLink>
            </span>
            <span>
              <NavLink to='/places'>Places</NavLink>
            </span>
          </div>
          <div className='clip-header__mobile-menu'>
            <Icon
              type='menu-fold'
              onClick={this.toggleMobileNav}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default NavBar;
