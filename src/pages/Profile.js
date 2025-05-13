import React from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    </div>
  );
};

export default Profile;
// This component is a placeholder for the user profile page.
// The complete implementation will include user details and options to update profile information.
// The component is structured similarly to the other components in the application, with a container, page header, and card layout.
// The page header includes a title, and the card body contains user information and a placeholder paragraph.
// The component is exported as the default export, making it available for use in other parts of the application.