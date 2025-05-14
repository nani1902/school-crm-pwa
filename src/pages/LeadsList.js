// src/pages/LeadsList.js
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { useOffline } from '../contexts/OfflineContext';
import OfflineStorage from '../services/OfflineStorage';
import './LeadsList.css';

// Components
import LeadCard from '../components/LeadCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const LeadsList = () => {
  // Offline context
  const { isOffline } = useOffline();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filterParams, setFilterParams] = useState({});
  
  // Lead status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Visit Scheduled', label: 'Visit Scheduled' },
    { value: 'Visit Completed', label: 'Visit Completed' },
    { value: 'Pending Evaluation', label: 'Pending Evaluation' },
    { value: 'Evaluated', label: 'Evaluated' },
    { value: 'Pending Principal Consent', label: 'Pending Principal Consent' },
    { value: 'Payment Pending', label: 'Payment Pending' },
    { value: 'Payment Verified', label: 'Payment Verified' },
    { value: 'Converted', label: 'Converted to Student' },
    { value: 'Dormant', label: 'Dormant' },
    { value: 'Not Interested', label: 'Not Interested' },
  ];

  // Fetch leads with React Query
  const { 
    data: onlineLeads = [], 
    isLoading, 
    error, 
    refetch 
  } = useLeads(filterParams);
  
  // Combine online and offline leads
  const [allLeads, setAllLeads] = useState([]);
  
  // Load offline leads and combine with online leads
  useEffect(() => {
    if (isOffline) {
      // When offline, use cached leads + offline created leads
      const cachedLeads = OfflineStorage.getCachedLeads();
      const offlineLeads = OfflineStorage.getOfflineLeads();
      setAllLeads([...cachedLeads, ...offlineLeads]);
    } else {
      // When online, use fetched leads + offline created leads
      const offlineLeads = OfflineStorage.getOfflineLeads();
      setAllLeads([...onlineLeads, ...offlineLeads]);
      
      // Cache online leads for offline use
      if (onlineLeads.length > 0) {
        OfflineStorage.saveLeadsToCache(onlineLeads);
      }
    }
  }, [isOffline, onlineLeads]);
  
  // Client-side filtering for search
  const [filteredLeads, setFilteredLeads] = useState([]);
  
  // Apply search filter (client-side)
  const applySearchFilter = useCallback(() => {
    if (!allLeads.length) return;
    
    let result = [...allLeads];
    
    // Apply search term filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(lead => 
        lead.full_name?.toLowerCase().includes(searchTermLower) ||
        lead.email?.toLowerCase().includes(searchTermLower) ||
        lead.phone_number?.includes(searchTerm) ||
        lead.area_of_residence?.toLowerCase().includes(searchTermLower) ||
        lead.parent_name?.toLowerCase().includes(searchTermLower)
      );
    }
    
    // If status filter is applied, filter by status
    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }
    
    setFilteredLeads(result);
  }, [allLeads, searchTerm, statusFilter]);
  
  // Update filtered leads when leads or search term changes
  useEffect(() => {
    applySearchFilter();
  }, [applySearchFilter, allLeads]);
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle form submit/filter
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    // When online and status filter is applied, update the API query params
    if (!isOffline && statusFilter) {
      const newParams = {};
      if (statusFilter) {
        newParams.status = statusFilter;
      }
      setFilterParams(newParams);
    } else {
      // When offline, we just apply the filter locally
      applySearchFilter();
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilterParams({});
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    if (!isOffline) {
      refetch();
    }
  };

  if (isLoading && !isOffline) {
    return <LoadingSpinner message="Loading leads..." />;
  }

  if (error && !isOffline) {
    return <ErrorAlert message="Failed to load leads. Please try again later." onRetry={handleRefresh} />;
  }

  // Get count of offline leads
  const offlineLeadsCount = OfflineStorage.getOfflineLeads().length;

  return (
    <div className="leads-list-container">
      <div className="page-header">
        <h1>All Leads</h1>
        <div className="header-actions">
          <Link to="/leads/new" className="btn btn-primary">
            <span className="material-icons">add</span>
            <span className="btn-text">Add New Lead</span>
          </Link>
          {!isOffline && (
            <button className="btn btn-outline-primary" onClick={handleRefresh}>
              <span className="material-icons">refresh</span>
              <span className="btn-text">Refresh</span>
            </button>
          )}
        </div>
      </div>
      
      {isOffline && (
        <div className="offline-alert">
          <span className="material-icons">cloud_off</span>
          <span>You are currently offline. You can view leads and add new ones.</span>
        </div>
      )}
      
      {/* Filters */}
      <div className="filters-card">
        <form onSubmit={handleFilterSubmit}>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="statusFilter">Status:</label>
              <select 
                id="statusFilter" 
                className="form-control"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group filter-search">
              <label htmlFor="searchTerm">Search:</label>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  id="searchTerm"
                  className="form-control"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    <span className="material-icons">close</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="filter-actions">
              <button type="submit" className="btn btn-primary">
                <span className="material-icons">filter_alt</span>
                <span className="btn-text">Filter</span>
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                <span className="material-icons">clear</span>
                <span className="btn-text">Clear</span>
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Active filters display */}
      {(statusFilter || searchTerm) && (
        <div className="active-filters">
          <span className="active-filters-label">
            <span className="material-icons">filter_list</span>
            Active filters:
          </span>
          
          {statusFilter && (
            <span className="filter-tag">
              Status: {statusFilter}
              <button 
                type="button" 
                className="tag-remove" 
                onClick={() => {
                  setStatusFilter('');
                  if (!isOffline) {
                    setFilterParams({});
                  }
                }}
              >
                <span className="material-icons">close</span>
              </button>
            </span>
          )}
          
          {searchTerm && (
            <span className="filter-tag">
              Search: {searchTerm}
              <button 
                type="button" 
                className="tag-remove" 
                onClick={() => setSearchTerm('')}
              >
                <span className="material-icons">close</span>
              </button>
            </span>
          )}
          
          <button 
            type="button" 
            className="clear-all-filters"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Results count */}
      <div className="results-count">
        Showing {filteredLeads.length} of {allLeads.length} leads
        {isOffline && offlineLeadsCount > 0 && (
          <span> (including {offlineLeadsCount} offline leads)</span>
        )}
      </div>
      
      {/* Leads list */}
      {filteredLeads.length > 0 ? (
        <div className="leads-list">
          {filteredLeads.map(lead => (
            <div key={lead.id || lead.temp_id}>
              <LeadCard lead={lead} />
              {lead.is_offline && (
                <div className="offline-lead-indicator">
                  <span className="material-icons">cloud_off</span>
                  Offline - Will sync when online
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <span className="material-icons">search_off</span>
          <p>No leads found matching your filters.</p>
          <button 
            className="btn btn-outline-primary"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadsList;