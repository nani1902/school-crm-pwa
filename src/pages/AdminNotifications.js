// src/pages/AdminNotifications.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../api/apiService';
import notificationService from '../services/NotificationService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './AdminNotifications.css';

const AdminNotifications = () => {
  const { role } = useAuth();
  
  // State management
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [notificationLink, setNotificationLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);

  // Fetch users and recent notifications when component mounts
  useEffect(() => {
    fetchUsers();
    fetchRecentNotifications();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get('users/');
      setUsers(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent notifications
  const fetchRecentNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get('notifications/recent/');
      setRecentNotifications(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching recent notifications:', err);
      // Don't show error for this, just log it
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Select all users
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  // Send test notification
  const handleSendTestNotification = async () => {
    try {
      setIsSending(true);
      setError(null);
      setSuccessMessage(null);
      
      const result = await notificationService.sendTestNotification();
      
      setSuccessMessage('Test notification sent successfully!');
      console.log('Test notification sent:', result);
    } catch (err) {
      console.error('Error sending test notification:', err);
      setError('Failed to send test notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Send custom notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (!notificationTitle || !notificationBody || selectedUsers.length === 0) {
      setError('Please fill all required fields and select at least one user.');
      return;
    }
    
    try {
      setIsSending(true);
      setError(null);
      setSuccessMessage(null);
      
      const notificationData = {
        title: notificationTitle,
        body: notificationBody,
        url: notificationLink || undefined,
        user_ids: selectedUsers
      };
      
      const result = await notificationService.sendCustomNotification(notificationData);
      
      setSuccessMessage(`Notification sent successfully to ${selectedUsers.length} user(s)!`);
      console.log('Custom notification sent:', result);
      
      // Reset form
      setNotificationTitle('');
      setNotificationBody('');
      setNotificationLink('');
      setSelectedUsers([]);
      
      // Refresh recent notifications
      fetchRecentNotifications();
    } catch (err) {
      console.error('Error sending custom notification:', err);
      setError('Failed to send notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle form reset
  const handleResetForm = () => {
    setNotificationTitle('');
    setNotificationBody('');
    setNotificationLink('');
    setSelectedUsers([]);
    setError(null);
    setSuccessMessage(null);
  };

  // Render loading state
  if (isLoading && users.length === 0) {
    return <LoadingSpinner message="Loading notification panel..." />;
  }

  // Check admin access
  if (role !== 'Admin' && role !== 'Principal') {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Notifications Management</h1>
        </div>
        <ErrorAlert message="You don't have permission to access this page." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Notifications Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-outline-primary" 
            onClick={handleSendTestNotification}
            disabled={isSending}
          >
            <span className="material-icons">notifications_active</span>
            <span className="btn-text">Send Test Notification</span>
          </button>
        </div>
      </div>

      {/* Error and success messages */}
      {error && (
        <div className="alert alert-danger">
          <span className="material-icons">error_outline</span>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <span className="material-icons">check_circle</span>
          {successMessage}
        </div>
      )}

      <div className="notification-panel">
        {/* Send notification form */}
        <div className="card notification-form-card">
          <div className="card-header">
            <h3>Send Custom Notification</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSendNotification}>
              <div className="form-group">
                <label htmlFor="notificationTitle">Title*</label>
                <input
                  type="text"
                  id="notificationTitle"
                  className="form-control"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Notification Title"
                  disabled={isSending}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="notificationBody">Message*</label>
                <textarea
                  id="notificationBody"
                  className="form-control"
                  value={notificationBody}
                  onChange={(e) => setNotificationBody(e.target.value)}
                  placeholder="Notification Message"
                  rows="3"
                  disabled={isSending}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="notificationLink">Link (Optional)</label>
                <input
                  type="text"
                  id="notificationLink"
                  className="form-control"
                  value={notificationLink}
                  onChange={(e) => setNotificationLink(e.target.value)}
                  placeholder="e.g., /leads/123"
                  disabled={isSending}
                />
                <small className="form-text text-muted">
                  User will be taken to this page when they click on the notification.
                </small>
              </div>
              
              <div className="form-group">
                <label>Recipients*</label>
                <div className="select-all-option">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleSelectAllUsers}
                    disabled={isSending}
                  >
                    {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="selected-count">
                    {selectedUsers.length} user(s) selected
                  </span>
                </div>
                
                <div className="users-select-list">
                  {users.map(user => (
                    <div key={user.id} className="user-select-item">
                      <label className="user-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelection(user.id)}
                          disabled={isSending}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="user-name">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.username}
                          <span className="user-role">{user.role || 'User'}</span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleResetForm}
                  disabled={isSending}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSending || !notificationTitle || !notificationBody || selectedUsers.length === 0}
                >
                  {isSending ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons">send</span>
                      <span>Send Notification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Recent notifications */}
        <div className="card recent-notifications-card">
          <div className="card-header">
            <h3>Recent Notifications</h3>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={fetchRecentNotifications}
            >
              <span className="material-icons">refresh</span>
            </button>
          </div>
          <div className="card-body">
            {recentNotifications.length > 0 ? (
              <div className="notification-history">
                {recentNotifications.map((notification, index) => (
                  <div key={index} className="notification-history-item">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-time">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p>{notification.body}</p>
                    <div className="notification-meta">
                      <span className="recipients-count">
                        <span className="material-icons">people</span>
                        Sent to {notification.recipient_count} user(s)
                      </span>
                      {notification.sender && (
                        <span className="sender">
                          <span className="material-icons">person</span>
                          Sent by {notification.sender.username}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="material-icons">notifications_none</span>
                <p>No recent notifications found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;