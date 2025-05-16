// src/services/NotificationService.js
import apiService from '../api/apiService';

// Feature flag to control notification functionality
const NOTIFICATIONS_ENABLED = false;

const convertedVapidKey = (publicVapidKey) => {
  const padding = '='.repeat((4 - publicVapidKey.length % 4) % 4);
  const base64 = (publicVapidKey + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
};

class NotificationService {
  constructor() {
    // VAPID public key from your backend (this is a placeholder - update it with your actual key)
    this.publicVapidKey = 'BLBn-NSHXkl7xK3dt8YSvkgaJ9gnJa6IqP_zn8_QuE8XNjbvLoKD-3nnT32cZqyS1bBrm4L2Dv7KKI_qLYTvrA8';
    this.isSubscribed = false;
    this.swRegistration = null;
  }

  // Initialize the notification service
  async init() {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('[Notification Service] Service workers are not supported');
        return false;
      }

      if (!('PushManager' in window)) {
        console.warn('[Notification Service] Push notifications are not supported');
        return false;
      }

      // Register the service worker with error handling
      try {
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        console.log('[Notification Service] Service Worker registered:', this.swRegistration);
      } catch (swError) {
        console.error('[Notification Service] Service Worker registration failed:', swError);
        
        // Try to unregister any existing service workers
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
          }
          console.log('[Notification Service] Cleared existing service workers');
          
          // Try registration again
          this.swRegistration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
          console.log('[Notification Service] Service Worker registered after cleanup:', this.swRegistration);
        } catch (retryError) {
          console.error('[Notification Service] Service Worker registration failed after cleanup:', retryError);
          return false;
        }
      }
      
      // Check if already subscribed
      this.isSubscribed = await this.checkSubscription();
      
      // Wait for service worker to be ready
      try {
        await navigator.serviceWorker.ready;
        console.log('[Notification Service] Service Worker is ready');
      } catch (readyError) {
        console.error('[Notification Service] Service Worker ready check failed:', readyError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[Notification Service] Error initializing:', error);
      return false;
    }
  }

  // Check if browser is already subscribed
  async checkSubscription() {
    try {
      if (!this.swRegistration) {
        await this.init();
      }
      
      const subscription = await this.swRegistration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error('[Notification Service] Error checking subscription:', error);
      return false;
    }
  }

  // Subscribe to push notifications
  async subscribe() {
    try {
      if (!this.swRegistration) {
        await this.init();
      }
      
      // Check for existing subscription
      let subscription = await this.swRegistration.pushManager.getSubscription();
      
      // If already subscribed, return the existing subscription
      if (subscription) {
        this.isSubscribed = true;
        return subscription;
      }
      
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission denied');
      }
      
      // Subscribe
      subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey(this.publicVapidKey)
      });
      
      console.log('[Notification Service] Subscribed:', subscription);
      
      // Save subscription on the server
      await this.saveSubscription(subscription);
      
      this.isSubscribed = true;
      return subscription;
    } catch (error) {
      console.error('[Notification Service] Error subscribing:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    try {
      if (!this.swRegistration) {
        await this.init();
      }
      
      const subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (!subscription) {
        this.isSubscribed = false;
        return true;
      }
      
      // Get subscription endpoint
      const endpoint = subscription.endpoint;
      
      // Unsubscribe
      const result = await subscription.unsubscribe();
      
      if (result) {
        console.log('[Notification Service] Unsubscribed successfully');
        
        // Remove subscription from server
        await this.deleteSubscription(endpoint);
        
        this.isSubscribed = false;
        return true;
      } else {
        throw new Error('Unsubscribe failed');
      }
    } catch (error) {
      console.error('[Notification Service] Error unsubscribing:', error);
      throw error;
    }
  }

  // Save subscription to server
  async saveSubscription(subscription) {
    if (!NOTIFICATIONS_ENABLED) {
      console.log('[Notification Service] Notifications are currently disabled');
      return null;
    }
    try {
      const response = await apiService.post('notifications/subscribe/', {
        subscription: JSON.stringify(subscription)
      });
      
      console.log('[Notification Service] Subscription saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Error saving subscription:', error);
      throw error;
    }
  }

  // Delete subscription from server
  async deleteSubscription(endpoint) {
    if (!NOTIFICATIONS_ENABLED) {
      console.log('[Notification Service] Notifications are currently disabled');
      return null;
    }
    try {
      const response = await apiService.post('notifications/unsubscribe/', {
        endpoint
      });
      
      console.log('[Notification Service] Subscription deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Error deleting subscription:', error);
      throw error;
    }
  }

  // Send a test notification (Admin only)
  async sendTestNotification() {
    if (!NOTIFICATIONS_ENABLED) {
      console.log('[Notification Service] Notifications are currently disabled');
      return null;
    }
    try {
      const response = await apiService.post('notifications/test/');
      console.log('[Notification Service] Test notification sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Error sending test notification:', error);
      throw error;
    }
  }

  // Send a custom notification (Admin only)
  async sendCustomNotification(notificationData) {
    if (!NOTIFICATIONS_ENABLED) {
      console.log('[Notification Service] Notifications are currently disabled');
      return null;
    }
    try {
      const response = await apiService.post('notifications/send/', notificationData);
      console.log('[Notification Service] Custom notification sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Error sending custom notification:', error);
      throw error;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;