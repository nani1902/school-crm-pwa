// src/services/InstallService.js

class InstallService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isInstallable = false;
  }

  // Initialize the install service
  init() {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      this.isInstallable = true;
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.isInstallable = false;
      this.deferredPrompt = null;
    });
  }

  // Check if the app is installable
  isAppInstallable() {
    return this.isInstallable && !this.isInstalled;
  }

  // Check if the app is already installed
  isAppInstalled() {
    return this.isInstalled;
  }

  // Trigger the install prompt
  async promptInstall() {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await this.deferredPrompt.userChoice;
      
      // Clear the deferred prompt
      this.deferredPrompt = null;
      
      // Check if the user accepted the installation
      if (choiceResult.outcome === 'accepted') {
        this.isInstalled = true;
        this.isInstallable = false;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }
}

// Create singleton instance
const installService = new InstallService();

export default installService; 