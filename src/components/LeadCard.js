import React from 'react';
import { Link } from 'react-router-dom';
import './LeadCard.css';

const LeadCard = ({ lead, showActions = true }) => {
  if (!lead) return null;
  
  // Function to get status class name
  const getStatusClass = (status) => {
    const statusMap = {
      'New': 'new',
      'Contacted': 'contacted',
      'Visit Scheduled': 'visit-scheduled',
      'Visit Completed': 'visit-completed',
      'Pending Evaluation': 'pending-evaluation',
      'Evaluated': 'evaluated',
      'Pending Principal Consent': 'pending-principal-consent',
      'Payment Pending': 'payment-pending',
      'Payment Verified': 'payment-verified',
      'Converted': 'converted',
      'Dormant': 'dormant',
      'Not Interested': 'not-interested'
    };
    
    return statusMap[status] || 'new';
  };
  
  return (
    <div className={`lead-card status-${getStatusClass(lead.status)}`}>
      <div className="lead-card-header">
        <Link to={`/leads/${lead.id}`} className="lead-name">
          {lead.full_name}
        </Link>
        <div className="lead-meta">
          <span className={`status-badge ${getStatusClass(lead.status)}`}>
            {lead.status_display || lead.status}
          </span>
        </div>
      </div>
      
      <div className="lead-card-body">
        <div className="lead-info-row">
          <div className="lead-info-item">
            <span className="info-label">
              <span className="material-icons">phone</span>
              Phone
            </span>
            <span className="info-value">
              {lead.phone_number || 'N/A'}
            </span>
          </div>
          
          <div className="lead-info-item">
            <span className="info-label">
              <span className="material-icons">email</span>
              Email
            </span>
            <span className="info-value">
              {lead.email || 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="lead-info-row">
          <div className="lead-info-item">
            <span className="info-label">
              <span className="material-icons">family_restroom</span>
              Parent
            </span>
            <span className="info-value">
              {lead.parent_name || 'N/A'}
            </span>
          </div>
          
          <div className="lead-info-item">
            <span className="info-label">
              <span className="material-icons">school</span>
              Class
            </span>
            <span className="info-value">
              {lead.interested_class || 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="lead-info-row">
          <div className="lead-info-item">
            <span className="info-label">
              <span className="material-icons">location_on</span>
              Area
            </span>
            <span className="info-value">
              {lead.area_of_residence || 'N/A'}
            </span>
          </div>
          
          <div className="lead-info-item">
            <span className="info-label">
              <span className="material-icons">event</span>
              Enquiry Date
            </span>
            <span className="info-value">
              {lead.date_of_enquiry || 'N/A'}
            </span>
          </div>
        </div>
        
        {lead.assigned_counselor && (
          <div className="lead-info-row">
            <div className="lead-info-item">
              <span className="info-label">
                <span className="material-icons">person</span>
                Assigned To
              </span>
              <span className="info-value">
                {lead.assigned_counselor.username || 'N/A'}
              </span>
            </div>
            
            <div className="lead-info-item">
              <span className="info-label">
                <span className="material-icons">event_available</span>
                Last Contact
              </span>
              <span className="info-value">
                {lead.last_contact_date || 'Never'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {showActions && (
        <div className="lead-card-footer">
          <Link to={`/leads/${lead.id}`} className="btn btn-sm btn-primary">
            <span className="material-icons">visibility</span>
            <span className="btn-text">View Details</span>
          </Link>
          
          <Link to={`/leads/${lead.id}/edit`} className="btn btn-sm btn-outline-warning">
            <span className="material-icons">edit</span>
            <span className="btn-text">Edit</span>
          </Link>
          
          <Link to={`/leads/${lead.id}/log`} className="btn btn-sm btn-outline-info">
            <span className="material-icons">add_comment</span>
            <span className="btn-text">Log Interaction</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LeadCard;