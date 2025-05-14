// src/components/OfflineSyncManager.js
import { useEffect } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import OfflineStorage from '../services/OfflineStorage';
import { useCreateLead } from '../hooks/useLeads';
import { useQueryClient } from '@tanstack/react-query';

const OfflineSyncManager = () => {
  const { isOffline } = useOffline();
  const { mutateAsync: createLead } = useCreateLead();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const syncOfflineLeads = async () => {
      // Only try to sync when coming back online
      if (!isOffline) {
        const offlineLeads = OfflineStorage.getOfflineLeads();
        
        if (offlineLeads.length > 0) {
          console.log(`Syncing ${offlineLeads.length} offline leads...`);
          
          for (const lead of offlineLeads) {
            try {
              // Remove offline-specific properties
              const { temp_id, is_offline, created_at, ...leadData } = lead;
              
              // Create lead on server
              await createLead(leadData);
              
              // Remove from offline storage after successful sync
              OfflineStorage.removeOfflineLead(temp_id);
            } catch (error) {
              console.error('Error syncing offline lead:', error);
              // We'll leave failed leads in offline storage to try again later
            }
          }
          
          // Refresh lead lists after sync
          queryClient.invalidateQueries('leads');
        }
      }
    };
    
    syncOfflineLeads();
  }, [isOffline, createLead, queryClient]);
  
  // This component doesn't render anything
  return null;
};

export default OfflineSyncManager;