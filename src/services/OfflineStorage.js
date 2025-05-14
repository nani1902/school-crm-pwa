// src/services/OfflineStorage.js
const OFFLINE_LEADS_KEY = 'offline_leads';

const OfflineStorage = {
  // Save leads that are loaded while online
  saveLeadsToCache: (leads) => {
    try {
      localStorage.setItem('cached_leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Error saving leads to cache:', error);
    }
  },

  // Get cached leads
  getCachedLeads: () => {
    try {
      const cachedLeads = localStorage.getItem('cached_leads');
      return cachedLeads ? JSON.parse(cachedLeads) : [];
    } catch (error) {
      console.error('Error getting cached leads:', error);
      return [];
    }
  },

  // Save a new lead created while offline
  saveOfflineLead: (lead) => {
    try {
      // Get existing offline leads
      const offlineLeads = OfflineStorage.getOfflineLeads();
      
      // Add a temporary ID and offline flag
      const offlineLead = {
        ...lead,
        temp_id: `offline_${Date.now()}`,
        is_offline: true,
        created_at: new Date().toISOString()
      };
      
      // Save to offline storage
      localStorage.setItem(OFFLINE_LEADS_KEY, JSON.stringify([...offlineLeads, offlineLead]));
      
      return offlineLead;
    } catch (error) {
      console.error('Error saving offline lead:', error);
      return null;
    }
  },

  // Get all leads created while offline
  getOfflineLeads: () => {
    try {
      const offlineLeads = localStorage.getItem(OFFLINE_LEADS_KEY);
      return offlineLeads ? JSON.parse(offlineLeads) : [];
    } catch (error) {
      console.error('Error getting offline leads:', error);
      return [];
    }
  },

  // Remove a lead from offline storage (after sync)
  removeOfflineLead: (tempId) => {
    try {
      const offlineLeads = OfflineStorage.getOfflineLeads();
      const updatedLeads = offlineLeads.filter(lead => lead.temp_id !== tempId);
      localStorage.setItem(OFFLINE_LEADS_KEY, JSON.stringify(updatedLeads));
    } catch (error) {
      console.error('Error removing offline lead:', error);
    }
  },

  // Clear all offline leads
  clearOfflineLeads: () => {
    localStorage.removeItem(OFFLINE_LEADS_KEY);
  }
};

export default OfflineStorage;