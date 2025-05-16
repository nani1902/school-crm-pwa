// src/components/InstallButton.js
import React, { useState, useEffect } from 'react';
import installService from '../services/InstallService';
import './InstallButton.css';

const InstallButton = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize the install service
    installService.init();

    // Check initial state
    setIsInstallable(installService.isAppInstallable());
    setIsInstalled(installService.isAppInstalled());

    // Listen for changes in installation state
    const checkInstallState = () => {
      setIsInstallable(installService.isAppInstallable());
      setIsInstalled(installService.isAppInstalled());
    };

    window.addEventListener('appinstalled', checkInstallState);
    return () => window.removeEventListener('appinstalled', checkInstallState);
  }, []);

  const handleInstall = async () => {
    setIsLoading(true);
    try {
      const installed = await installService.promptInstall();
      if (installed) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  if (!isInstallable) {
    return null; // Don't show if not installable
  }

  return (
    <button
      className="install-button"
      onClick={handleInstall}
      disabled={isLoading}
      title="Install Sri Gurukulam Crm App"
    >
      <span className="material-icons">
        {isLoading ? 'hourglass_empty' : 'get_app'}
      </span>
      <span className="button-text">
        {isLoading ? 'Installing...' : 'Install App'}
      </span>
    </button>
  );
};

export default InstallButton; 