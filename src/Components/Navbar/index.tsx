import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import { Icon } from 'antd';

import Search from '../Search';
import SideNav from '../SideNav';

import { INavbarState } from '../../../types';
import { contrast } from '../../assets';
import {
  CLICK, CUSTOM_NAV_ELEMENT, FLIP_THEME, LIGHT,
  MAXIMUM_SCROLL_DISTANCE, MINIMUM_SCROLL_DISTANCE, NAV_BAR_BOX_SHADOW,
  NAV_BAR_ELEMENT, NO_DISPLAY, PLACES_PATH, ROOT_PATH, SCROLL, STORAGE, THEME, THEME_ATTRIBUTE,
} from '../../settings';

class NavBar extends Component<any, INavbarState> {
  public state = {
    isSideNavOpen: false,
  };

  public node: any;

  public componentDidMount() {
    this.loadTheme();

    window.addEventListener(STORAGE, this.handleDarkModeToggle);

    window.addEventListener(SCROLL, this.handlePageScroll, {
      capture: true,
      passive: true,
    });
  }

  public componentWillUnmount() {
    window.removeEventListener(STORAGE, this.handleDarkModeToggle);
    window.removeEventListener(SCROLL, this.handlePageScroll, false);
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

  public toggleDarkMode = () => {
    const currentTheme: string = window.localStorage.getItem(THEME) || LIGHT;
    const theme: string = FLIP_THEME[currentTheme];

    window.localStorage.setItem(THEME, theme);
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }

  public handleDarkModeToggle = (event: any) => {
    if (event.key !== THEME) {
      return;
    }

    this.loadTheme();
  }

  public loadTheme = () => {
    const currentTheme = window.localStorage.getItem(THEME) || LIGHT;
    window.document.documentElement.setAttribute(THEME_ATTRIBUTE, currentTheme);
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

  public renderThemeButton() {
    return (
      <span className='dark-mode-switch'>
        <Icon
          type='bulb'
          onClick={this.toggleDarkMode}
        />
      </span>
    );
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
            {this.renderThemeButton()}
          </div>
          <div className='clip-header__mobile-menu'>
            <Icon
              type='menu-fold'
              onClick={this.toggleMobileNav}
            />
            {this.renderThemeButton()}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default NavBar;
