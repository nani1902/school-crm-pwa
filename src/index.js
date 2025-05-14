import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import notificationService from './services/NotificationService';

// Initialize notification service
if ('serviceWorker' in navigator) {
  // Wait for the window to load to ensure all assets are ready
  window.addEventListener('load', () => {
    notificationService.init()
      .then(supported => {
        if (supported) {
          console.log('Push notification service initialized');
        } else {
          console.log('Push notifications not supported in this browser');
        }
      })
      .catch(error => {
        console.error('Error initializing push notifications:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);