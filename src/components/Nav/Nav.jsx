import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <div className="navbar">
    <div>
      <ul>
        <li>
          <Link to="/home">
            Home
          </Link>
        </li>
        <li>
          <Link to="/topicPage">
            Topic Page
          </Link>
        </li>
        <li>
          <Link to="/topicManage">
            ADMIN Topic Manage
          </Link>
        </li>
        <li>
          <Link to="/topicEdit">
            Topic Edit
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Nav;
