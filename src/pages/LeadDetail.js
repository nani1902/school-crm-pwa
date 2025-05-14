// src/pages/LeadDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLead } from '../hooks/useLeads';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './LeadDetail.css';

const LeadDetail = () => {
  const { id } = useParams();
  const { 
    data: lead, 
    isLoading, 
    error, 
    refetch 
  } = useLead(id);

  if (isLoading) {
    return <LoadingSpinner message="Loading lead details..." />;
  }

  if (error) {
    return <ErrorAlert 
      message="Failed to load lead details. Please try again later." 
      onRetry={refetch}
    />;
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
          <button 
            onClick={refetch} 
            className="btn btn-outline-secondary"
            title="Refresh lead data"
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>
      </div>

      <div className="lead-detail-content">
        {/* Basic Information */}
        <div className="card mb-4">
          <div className="card-header">
            <h3>Basic Information</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Full Name:</div>
              <div className="col-md-9">{lead.full_name}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Status:</div>
              <div className="col-md-9">
                <span className={`status-badge ${lead.status?.toLowerCase()}`}>
                  {lead.status_display || lead.status}
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Email:</div>
              <div className="col-md-9">{lead.email || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Phone:</div>
              <div className="col-md-9">{lead.phone_number || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Parent Name:</div>
              <div className="col-md-9">{lead.parent_name || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Area of Residence:</div>
              <div className="col-md-9">{lead.area_of_residence || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Interested Class:</div>
              <div className="col-md-9">{lead.interested_class?.class_name || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Source:</div>
              <div className="col-md-9">{lead.source_display || lead.source || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Date of Enquiry:</div>
              <div className="col-md-9">{lead.date_of_enquiry || 'N/A'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Notes:</div>
              <div className="col-md-9">
                <div className="bg-light p-2 rounded">
                  {lead.notes || 'No notes available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactions */}
        {lead.interactions && lead.interactions.length > 0 && (
          <div className="card mb-4">
            <div className="card-header">
              <h3>Recent Interactions</h3>
            </div>
            <div className="card-body">
              <div className="timeline">
                {lead.interactions.map((interaction, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-badge">
                      <span className="material-icons">
                        {interaction.interaction_type === 'Call' ? 'call' : 
                         interaction.interaction_type === 'Email Sent' ? 'email' :
                         interaction.interaction_type === 'Meeting' ? 'meeting_room' :
                         'chat'}
                      </span>
                    </div>
                    <div className="timeline-content">
                      <h4>
                        {interaction.interaction_type_display || interaction.interaction_type}
                        {interaction.subject && <span> - {interaction.subject}</span>}
                      </h4>
                      <p className="timeline-date">{interaction.interaction_date_time}</p>
                      <p>{interaction.details}</p>
                      {interaction.outcome && <p><strong>Outcome:</strong> {interaction.outcome}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link to={`/leads/${id}/log`} className="btn btn-primary">
                  <span className="material-icons">add_comment</span>
                  <span className="btn-text">Log Interaction</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Appointments */}
        {lead.appointments && lead.appointments.length > 0 && (
          <div className="card mb-4">
            <div className="card-header">
              <h3>Appointments</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Campus</th>
                      <th>Scheduled By</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.appointments.map((appointment, index) => (
                      <tr key={index}>
                        <td>{appointment.appointment_date}</td>
                        <td>{appointment.appointment_time}</td>
                        <td>{appointment.campus_display || appointment.campus}</td>
                        <td>{appointment.scheduled_by?.username || 'N/A'}</td>
                        <td>{appointment.notes || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-4">
                <Link to={`/leads/${id}/schedule`} className="btn btn-primary">
                  <span className="material-icons">event_available</span>
                  <span className="btn-text">Schedule Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card">
          <div className="card-header">
            <h3>Actions</h3>
          </div>
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              <Link to={`/leads/${id}/log`} className="btn btn-info">
                <span className="material-icons">add_comment</span>
                <span className="btn-text">Log Interaction</span>
              </Link>
              <Link to={`/leads/${id}/schedule`} className="btn btn-primary">
                <span className="material-icons">event_available</span>
                <span className="btn-text">Schedule Appointment</span>
              </Link>
              <Link to={`/leads/${id}/edit`} className="btn btn-warning">
                <span className="material-icons">edit</span>
                <span className="btn-text">Edit Lead</span>
              </Link>
              {/* Add more action buttons based on lead status */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;