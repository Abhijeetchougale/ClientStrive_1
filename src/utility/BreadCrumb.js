// src\Component\BreadCrumb\BreadCrumb.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  pathnames.unshift(<strong key="ClientStrive">ClientStrive</strong>);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {isLast ? (
                name
              ) : (
                <Link to={routeTo}>{name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
