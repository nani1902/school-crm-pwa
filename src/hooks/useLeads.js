// src/hooks/useLeads.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsAPI } from '../api/apiService';

// Key constants for better organization
export const leadKeys = {
  all: ['leads'],
  lists: () => [...leadKeys.all, 'list'],
  list: (filters) => [...leadKeys.lists(), filters],
  details: () => [...leadKeys.all, 'detail'],
  detail: (id) => [...leadKeys.details(), id],
};

// Hook for fetching all leads with filters
export const useLeads = (filters = {}) => {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => leadsAPI.getLeads(filters),
    // If no data is received, return an empty array
    select: (data) => data?.results || data || [],
  });
};

// Hook for fetching a single lead
export const useLead = (leadId) => {
  return useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: () => leadsAPI.getLead(leadId),
    // Only fetch if we have a leadId
    enabled: !!leadId,
  });
};

// Hook for creating a new lead
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (leadData) => leadsAPI.createLead(leadData),
    onSuccess: () => {
      // Invalidate the leads list query to refresh the data
      queryClient.invalidateQueries(leadKeys.lists());
    },
  });
};

// Hook for updating a lead
export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, data }) => leadsAPI.updateLead(leadId, data),
    onSuccess: (data, variables) => {
      // Invalidate specific queries
      queryClient.invalidateQueries(leadKeys.detail(variables.leadId));
      queryClient.invalidateQueries(leadKeys.lists());
    },
  });
};

// Hook for updating a lead's status
export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, status }) => leadsAPI.updateLeadStatus(leadId, status),
    onSuccess: (data, variables) => {
      // Invalidate specific queries
      queryClient.invalidateQueries(leadKeys.detail(variables.leadId));
      queryClient.invalidateQueries(leadKeys.lists());
    },
  });
};

// Hook for logging an interaction
export const useLogInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, interactionData }) => leadsAPI.logInteraction(leadId, interactionData),
    onSuccess: (data, variables) => {
      // Invalidate the lead detail query to refresh the data
      queryClient.invalidateQueries(leadKeys.detail(variables.leadId));
    },
  });
};