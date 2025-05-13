import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ScheduleAppointment = () => {
  const { id } = useParams();
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>Schedule Appointment</h1>
        <div className="header-actions">
          <Link to={`/leads/${id}`} className="btn btn-outline-secondary">
            <span className="material-icons">arrow_back</span>
            <span className="btn-text">Back to Lead</span>
          </Link>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Appointment Details</h3>
        </div>
        <div className="card-body">
          <p>This is a placeholder for the schedule appointment form. The complete implementation will include a form to schedule an appointment.</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;