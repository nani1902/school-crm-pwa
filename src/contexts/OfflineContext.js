// src/contexts/OfflineContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineLeads, setOfflineLeads] = useState([]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Provide context value
  const value = {
    isOffline,
    offlineLeads,
    setOfflineLeads
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export default OfflineContext;