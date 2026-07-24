import React from 'react';
import { Moon, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="nav-logo">
          <span className="logo-dark">Left</span>
          <span className="logo-green">Over</span>
        </div>

        {/* Center Navigation Links */}
        <ul className="nav-links">
          <li><a href="#discover">Discover</a></li>
          <li><a href="#donate">Donate</a></li>
          <li><a href="#mission">Mission</a></li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          <button className="icon-btn" aria-label="Toggle theme">
            <Moon size={19} />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={19} />
          </button>
          <button className="btn-list-food">
            List Food
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;