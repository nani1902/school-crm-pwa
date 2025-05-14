import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotificationPermission from '../components/NotificationPermission';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>User Profile</h1>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Profile Information</h3>
        </div>
        <div className="card-body">
          {user && (
            <div>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            </div>
          )}
          <p>This is a placeholder for the user profile page. The complete implementation will include user details and options to update profile information.</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Notification Settings</h3>
        </div>
        <div className="card-body">
          <NotificationPermission />
          <p className="text-muted mt-3">
            <small>
              Receive notifications for lead assignments, status changes, and other important updates. 
              Notifications will appear on your device, even when you're not using the app.
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;