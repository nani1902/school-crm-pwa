// src/components/NotificationPermission.js
import React, { useState, useEffect } from 'react';
import notificationService from '../services/NotificationService';
import './NotificationPermission.css';

const NotificationPermission = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check subscription status when component mounts
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        const subscribed = await notificationService.checkSubscription();
        setIsSubscribed(subscribed);
      } catch (err) {
        console.error('Error checking notification subscription:', err);
        setError('Failed to check notification status');
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await notificationService.subscribe();
      setIsSubscribed(true);
    } catch (err) {
      console.error('Error subscribing to notifications:', err);
      if (err.message === 'Permission denied') {
        setError('Notification permission denied. Please enable notifications in your browser settings.');
      } else {
        setError('Failed to subscribe to notifications');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await notificationService.unsubscribe();
      setIsSubscribed(false);
    } catch (err) {
      console.error('Error unsubscribing from notifications:', err);
      setError('Failed to unsubscribe from notifications');
    } finally {
      setIsLoading(false);
    }
  };

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return (
      <div className="notification-permission unsupported">
        <div className="notification-icon">
          <span className="material-icons">notifications_off</span>
        </div>
        <div className="notification-content">
          <h4>Notifications Not Supported</h4>
          <p>Your browser does not support push notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-permission">
      <div className="notification-icon">
        <span className="material-icons">
          {isSubscribed ? 'notifications_active' : 'notifications_none'}
        </span>
      </div>
      <div className="notification-content">
        <h4>Push Notifications</h4>
        <p>
          {isSubscribed
            ? 'You are currently receiving push notifications'
            : 'Enable push notifications to receive real-time updates'}
        </p>

        {error && <div className="notification-error">{error}</div>}

        <button
          className={`notification-button ${isSubscribed ? 'unsubscribe' : 'subscribe'}`}
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <span className="material-icons">{isSubscribed ? 'notifications_off' : 'notifications'}</span>
          )}
          {isLoading
            ? 'Processing...'
            : isSubscribed
              ? 'Disable Notifications'
              : 'Enable Notifications'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPermission;