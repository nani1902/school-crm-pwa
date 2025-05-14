// src/hooks/useStudents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsAPI } from '../api/apiService';

// Key constants
export const studentKeys = {
  all: ['students'],
  lists: () => [...studentKeys.all, 'list'],
  list: (filters) => [...studentKeys.lists(), filters],
  details: () => [...studentKeys.all, 'detail'],
  detail: (id) => [...studentKeys.details(), id],
};

// Hook for fetching all students with filters
export const useStudents = (filters = {}) => {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentsAPI.getStudents(filters),
    select: (data) => data?.results || data || [],
  });
};

// Hook for fetching a single student
export const useStudent = (studentId) => {
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => studentsAPI.getStudent(studentId),
    enabled: !!studentId,
  });
};

export default useStudents;