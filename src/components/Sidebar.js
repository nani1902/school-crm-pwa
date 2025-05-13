import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { role } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Close mobile sidebar when switching to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    // Common links for all users
    const links = [
      { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { to: '/leads', label: 'Leads', icon: 'person_add' },
    ];

    // Role-specific links
    if (role === 'Admin' || role === 'Principal') {
      links.push(
        { to: '/admin/users', label: 'Manage Users', icon: 'group' },
        { to: '/admin/pipeline', label: 'Pipeline View', icon: 'stacked_line_chart' }
      );
    }
    
    if (role === 'Admin' || role === 'Office Desk') {
      links.push({ to: '/admin/admissions', label: 'Admissions', icon: 'school' });
    }
    
    if (role === 'Teaching Coordinator') {
      links.push({ to: '/evaluations', label: 'Evaluations', icon: 'assignment' });
    }
    
    if (role === 'Principal') {
      links.push({ to: '/approvals', label: 'Pending Approvals', icon: 'approval' });
    }
    
    // Add analytics for admin users
    if (role === 'Admin') {
      links.push({ to: '/analytics', label: 'Analytics', icon: 'insights' });
    }
    
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <span className="material-icons">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      )}

      {/* Sidebar Backdrop (Mobile) */}
      {isMobile && isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>School CRM</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className={location.pathname === link.to ? 'active' : ''}
                >
                  <span className="material-icons">{link.icon}</span>
                  <span className="nav-text">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;