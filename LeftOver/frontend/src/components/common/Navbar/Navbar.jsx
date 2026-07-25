import React, { useState } from 'react';
import { Moon, Sun, Bell, User, ShoppingBag, LogIn, Settings, ShieldCheck, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ 
  activePage = 'discover', 
  onNavigate, 
  onOpenListFood,
  theme,
  toggleTheme,
  reservedCount = 0,
  currentUser,
  onOpenAuth,
  onOpenProfileSettings,
  onOpenVerification,
  onSignOut
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setShowMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="nav-logo" onClick={() => handleNavigate('home')}>
          <span className="logo-dark">Left</span>
          <span className="logo-green">Over</span>
        </div>

        <ul className={`nav-links ${showMobileMenu ? 'mobile-open' : ''}`}>
          <li className={activePage === 'discover' || activePage === 'detail' ? 'active' : ''}>
            <button className="nav-link-btn" onClick={() => handleNavigate('discover')}>
              Discover
            </button>
          </li>
          <li className={activePage === 'dashboard' ? 'active' : ''}>
            <button className="nav-link-btn" onClick={() => handleNavigate('dashboard')}>
              Dashboard
            </button>
          </li>
          <li className={activePage === 'donate' ? 'active' : ''}>
            <button className="nav-link-btn" onClick={() => handleNavigate('donate')}>
              Donate
            </button>
          </li>
          <li className={activePage === 'mission' ? 'active' : ''}>
            <button className="nav-link-btn" onClick={() => handleNavigate('mission')}>
              Mission
            </button>
          </li>
        </ul>

        <div className="nav-actions">
          <button 
            className="btn-list-food"
            onClick={onOpenListFood}
          >
            List Food
          </button>

          <button 
            className="icon-btn notification-btn" 
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowMobileMenu(false);
            }}
          >
            <Bell size={19} />
            {reservedCount > 0 && <span className="notification-badge">{reservedCount}</span>}
          </button>

          <button 
            className="icon-btn theme-toggle-btn" 
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button 
            className="icon-btn mobile-menu-toggle" 
            aria-label="Toggle menu"
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>


          <div className="profile-wrapper">
            {currentUser ? (
              <button 
                className="profile-avatar-btn"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                aria-label="User profile menu"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="nav-avatar-img" />
                ) : (
                  <div className="default-nav-avatar">
                    <User size={18} />
                  </div>
                )}
              </button>
            ) : (
              <button 
                className="btn-nav-auth"
                onClick={onOpenAuth}
              >
                <LogIn size={15} />
                <span>Sign In / Register</span>
              </button>
            )}

            {currentUser && showProfileMenu && (
              <div className="dropdown-menu profile-dropdown">
                <div className="dropdown-user-info">
                  <strong>{currentUser.name}</strong>
                  <span>{currentUser.email}</span>
                  {currentUser.isEmailVerified ? (
                    <span className="nav-verified-badge"><ShieldCheck size={12} /> Email & Mobile Verified</span>
                  ) : (
                    <button className="btn-unverified-tag" onClick={() => { onOpenVerification?.(); setShowProfileMenu(false); }}>
                      <ShieldCheck size={12} /> Verify Email & Mobile
                    </button>
                  )}
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { onOpenVerification?.(); setShowProfileMenu(false); }}>
                  <ShieldCheck size={14} style={{ marginRight: 6 }} /> Verify Email & Mobile
                </button>
                <button className="dropdown-item" onClick={() => { onOpenProfileSettings(); setShowProfileMenu(false); }}>
                  <Settings size={14} style={{ marginRight: 6 }} /> Edit Profile Settings
                </button>
                <button className="dropdown-item" onClick={() => { onNavigate('dashboard'); setShowProfileMenu(false); }}>My Dashboard</button>
                <button className="dropdown-item" onClick={() => { onNavigate('dashboard'); setShowProfileMenu(false); }}>My Pickups ({reservedCount})</button>
                <button className="dropdown-item" onClick={() => { onOpenListFood(); setShowProfileMenu(false); }}>My Listings</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={() => { onSignOut(); setShowProfileMenu(false); }}>Sign Out</button>
              </div>
            )}
          </div>

          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <strong>Notifications</strong>
              </div>
              <div className="dropdown-divider"></div>
              {reservedCount > 0 ? (
                <div className="notification-item">
                  <ShoppingBag size={16} className="notif-icon-success" />
                  <div>
                    <p className="notif-title">Reservation Confirmed!</p>
                <p className="notif-sub">You have {reservedCount} active pickup(s) ready.</p>
                  </div>
                </div>
              ) : (
                <div className="notification-item empty">
                  <p className="notif-sub">No notifications yet.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;