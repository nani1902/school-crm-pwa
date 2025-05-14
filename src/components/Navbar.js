import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    // Redirect happens automatically via protected route
  };

  const getUserInitials = () => {
    if (!user) return '?';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    
    return user.username ? user.username[0].toUpperCase() : '?';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          {/* Page title could go here */}
        </div>
        <div className="navbar-right">
          <NotificationBell />
          <div className="user-dropdown" ref={dropdownRef}>
            <button
              className="avatar-button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              <div className="avatar">{getUserInitials()}</div>
              <span className="user-name">
                {user?.first_name 
                  ? `${user.first_name} ${user.last_name || ''}`
                  : user?.username}
              </span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <strong>{user?.username}</strong>
                  <div className="text-muted small">{user?.email}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;