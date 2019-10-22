import React from 'react';
import { NavLink } from 'react-router-dom';

import './_SideNav.scss'
import { LEFT_SIDEBAR_NAV_LINKS } from '../../settings';

const SideNav = () => {
  const renderNavLinks = () => {
    const navLinksMap = LEFT_SIDEBAR_NAV_LINKS.map((navLink) => {
      const {
        key, label, link
      } = navLink;

      return (
        <div key={key}>
          <NavLink
            to={link}
            className='sidebar-navlink'
          >
            {label}
          </NavLink>
        </div>
      );
    });

    return navLinksMap;
  };

  return (
    <div
      className="sidenav"
      id="mySidenav"
    >
      {renderNavLinks()}
    </div>
  );
};

export default SideNav;
