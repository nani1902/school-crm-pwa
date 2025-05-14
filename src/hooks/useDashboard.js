// src/hooks/useDashboard.js
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api/apiService';

// Key constants
export const dashboardKeys = {
  all: ['dashboard'],
  data: () => [...dashboardKeys.all, 'data'],
};

// Hook for fetching dashboard data
export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: () => dashboardAPI.getDashboardData(),
    staleTime: 1000 * 60 * 2, // Dashboard data is fresh for 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch dashboard data every 5 minutes
  });
};

export default useDashboard;