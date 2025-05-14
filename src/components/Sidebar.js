// Modified src/components/Sidebar.js
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
    // Main navigation links
    const links = [
      { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { to: '/leads/new', label: 'Add New Lead', icon: 'person_add' },
    ];

    // Administration section links
    const adminLinks = [
      { to: '/admin/dashboard', label: 'Admin Dashboard', icon: 'admin_panel_settings' },
      { to: '/admin/users', label: 'Manage Users', icon: 'group' },
      { to: '/admin/leads', label: 'Manage Leads', icon: 'list_alt' },
      { to: '/admin/notifications', label: 'Notifications', icon: 'notifications' },
      { to: '/admin/pipeline', label: 'Pipeline View', icon: 'stacked_line_chart' },
      { to: '/admin/admissions', label: 'Manage Admissions', icon: 'school' },
      { to: '/admin/system-log', label: 'System Log', icon: 'receipt_long' },
      { to: '/admin/django', label: 'Django Admin', icon: 'code' },
    ];

    // Analytics & Reports section links
    const analyticsLinks = [
      { to: '/analytics/dashboard', label: 'Analytics Dashboard', icon: 'insights' },
      { to: '/analytics/lead-conversion', label: 'Lead Conversion Report', icon: 'assessment' },
      { to: '/analytics/performance', label: 'Performance Report', icon: 'bar_chart' },
    ];

    // Only add admin links if user has appropriate role
    if (role === 'Admin' || role === 'Principal') {
      links.push({ section: 'Administration', items: adminLinks });
    }
    
    // Add analytics links for appropriate roles
    if (role === 'Admin') {
      links.push({ section: 'Analytics & Reports', items: analyticsLinks });
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
          <h2><span className="text-primary">School</span>CRM</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navLinks.map((item, index) => {
              // Check if it's a section with sub-items
              if (item.section) {
                return (
                  <li key={index} className="nav-section">
                    <div className="section-title">{item.section}</div>
                    <ul className="sub-nav">
                      {item.items.map((subItem, subIndex) => (
                        <li key={`${index}-${subIndex}`}>
                          <Link 
                            to={subItem.to} 
                            className={location.pathname === subItem.to ? 'active' : ''}
                          >
                            <span className="material-icons">{subItem.icon}</span>
                            <span className="nav-text">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              } else {
                // Regular menu item
                return (
                  <li key={index}>
                    <Link 
                      to={item.to} 
                      className={location.pathname === item.to ? 'active' : ''}
                    >
                      <span className="material-icons">{item.icon}</span>
                      <span className="nav-text">{item.label}</span>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;