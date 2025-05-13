import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadsAPI } from '../api/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './LeadDetail.css';

const LeadDetail = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        setError(null);
        const leadData = await leadsAPI.getLead(id);
        setLead(leadData);
      } catch (err) {
        console.error('Failed to fetch lead details:', err);
        setError('Failed to load lead details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading lead details..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!lead) {
    return <ErrorAlert message="Lead not found" />;
  }

  return (
    <div className="lead-detail-container">
      <div className="page-header">
        <h1>Lead Details: {lead.full_name}</h1>
        <div className="header-actions">
          <Link to={`/leads/${id}/edit`} className="btn btn-warning">
            <span className="material-icons">edit</span>
            <span className="btn-text">Edit Lead</span>
          </Link>
        </div>
      </div>

      <div className="lead-detail-content">
        <div className="card">
          <div className="card-header">
            <h3>Basic Information</h3>
          </div>
          <div className="card-body">
            <p>This is a placeholder for the lead detail page. The complete implementation will display all lead information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;