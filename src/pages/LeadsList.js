// src/pages/LeadsList.js
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import './LeadsList.css';

// Components
import LeadCard from '../components/LeadCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const LeadsList = () => {
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
    data: leads = [], 
    isLoading, 
    error, 
    refetch 
  } = useLeads(filterParams);
  
  // Client-side filtering for search
  const [filteredLeads, setFilteredLeads] = useState([]);
  
  // Apply search filter (client-side)
  const applySearchFilter = useCallback(() => {
    if (!leads) return;
    
    let result = [...leads];
    
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
    
    setFilteredLeads(result);
  }, [leads, searchTerm]);
  
  // Update filtered leads when leads or search term changes
  useEffect(() => {
    applySearchFilter();
  }, [applySearchFilter, leads]);
  
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
    
    // When status filter is applied, update the API query params
    const newParams = {};
    if (statusFilter) {
      newParams.status = statusFilter;
    }
    
    setFilterParams(newParams);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilterParams({});
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading leads..." />;
  }

  if (error) {
    return <ErrorAlert message="Failed to load leads. Please try again later." onRetry={handleRefresh} />;
  }

  return (
    <div className="leads-list-container">
      <div className="page-header">
        <h1>All Leads</h1>
        <div className="header-actions">
          <Link to="/leads/new" className="btn btn-primary">
            <span className="material-icons">add</span>
            <span className="btn-text">Add New Lead</span>
          </Link>
          <button className="btn btn-outline-primary" onClick={handleRefresh}>
            <span className="material-icons">refresh</span>
            <span className="btn-text">Refresh</span>
          </button>
        </div>
      </div>
      
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
                  setFilterParams({});
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
        Showing {filteredLeads.length} of {leads.length} leads
      </div>
      
      {/* Leads list */}
      {filteredLeads.length > 0 ? (
        <div className="leads-list">
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
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