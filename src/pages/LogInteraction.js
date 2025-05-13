import React from 'react';
import { useParams, Link } from 'react-router-dom';

const LogInteraction = () => {
  const { id } = useParams();
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>Log Interaction</h1>
        <div className="header-actions">
          <Link to={`/leads/${id}`} className="btn btn-outline-secondary">
            <span className="material-icons">arrow_back</span>
            <span className="btn-text">Back to Lead</span>
          </Link>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Interaction Details</h3>
        </div>
        <div className="card-body">
          <p>This is a placeholder for the log interaction form. The complete implementation will include a form to log an interaction.</p>
        </div>
      </div>
    </div>
  );
};

export default LogInteraction;