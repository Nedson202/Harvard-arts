import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';
import Search from '../Search/Search';
import { rootPath, placesPath, navBarElement, noDisplay,
  navBarBoxShadow, minimumScrollDistance, maximumScrollDistance,
  customNavElement
} from '../../utils';

class NavBar extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handlePageScroll, {
      capture: true,
      passive: true
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handlePageScroll, {
      capture: true,
      passive: true
    });
  }

  handlePageScroll = () => {
    const pathName = window.location.pathname;
    const lowerScrollPosition = document.body.scrollTop < minimumScrollDistance
    || document.documentElement.scrollTop < maximumScrollDistance;

    if (pathName !== placesPath && lowerScrollPosition) {
      document.getElementById(navBarElement).style.boxShadow = noDisplay;
    }

    if (
      document.body.scrollTop > minimumScrollDistance
      || document.documentElement.scrollTop > minimumScrollDistance
    ) {
      document.getElementById(navBarElement).style.boxShadow = navBarBoxShadow;
    }
  }

  render() {
    const pathName = window.location.pathname;
    const styleName = pathName === rootPath && customNavElement;

    return (
      <div className={`${'clip-header__nav'} ${styleName}`} id="nav-bar">
        <h1 className="clip-header__nav-logo">
          <NavLink to="/">Art Museum</NavLink>
        </h1>
        <div>
          <Search />
        </div>
        <div className="clip-header__menu">
          <span>
            <NavLink to="/collections">
              Collections
            </NavLink>
          </span>
          <span>
            <NavLink to="/publications">Publications</NavLink>
          </span>
          <span>
            <NavLink to="/places">Places</NavLink>
          </span>
        </div>
        <div className="clip-header__mobile-menu">
          <Icon type="menu-fold" />
        </div>
      </div>
    );
  }
}

export default NavBar;
