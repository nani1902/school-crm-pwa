// src/components/NotificationBell.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 60000); // Check for new notifications every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle clicks outside of notification dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications from API
  const fetchNotifications = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      
      const response = await apiService.get('notifications/user/');
      
      // Process notifications
      setNotifications(response.data.results || response.data || []);
      
      // Count unread notifications
      const unread = (response.data.results || response.data || [])
        .filter(notification => !notification.read)
        .length;
      
      setUnreadCount(unread);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (!silent) {
        setError('Failed to load notifications');
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await apiService.post(`notifications/${notificationId}/read/`);
      
      // Update notification status locally
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await apiService.post('notifications/read-all/');
      
      // Update all notifications to read
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // If notification not read yet, mark it as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Close the dropdown
    setIsOpen(false);
  };

  return (
    <div className="notification-bell-container" ref={notificationRef}>
      <button 
        className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={toggleNotifications}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <span className="material-icons">
          {unreadCount > 0 ? 'notifications_active' : 'notifications'}
        </span>
        {unreadCount > 0 && (
          <span className="notification-badge" data-count={unreadCount}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read" 
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-body">
            {isLoading ? (
              <div className="notification-loading">
                <div className="spinner"></div>
                <p>Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="notification-error">
                <span className="material-icons">error_outline</span>
                <p>{error}</p>
                <button 
                  className="btn-retry" 
                  onClick={() => fetchNotifications()}
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="material-icons">notifications_none</span>
                <p>No notifications</p>
              </div>
            ) : (
              <ul className="notification-list">
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  >
                    <Link 
                      to={notification.url || '#'} 
                      className="notification-link"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        <span className="material-icons">
                          {notification.icon || 'notifications'}
                        </span>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.body}</div>
                        <div className="notification-time">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                    </Link>
                    {!notification.read && (
                      <button 
                        className="notification-mark-read"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          markAsRead(notification.id);
                        }}
                        aria-label="Mark as read"
                      >
                        <span className="material-icons">check_circle</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="notification-footer">
            <Link 
              to="/profile" 
              className="notification-settings"
              onClick={() => setIsOpen(false)}
            >
              Notification Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;