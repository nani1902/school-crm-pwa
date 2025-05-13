import React from 'react';
import { useParams, Link } from 'react-router-dom';

const EditLead = () => {
  const { id } = useParams();
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Lead</h1>
        <div className="header-actions">
          <Link to={`/leads/${id}`} className="btn btn-outline-secondary">
            <span className="material-icons">arrow_back</span>
            <span className="btn-text">Back to Lead</span>
          </Link>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Edit Lead Information</h3>
        </div>
        <div className="card-body">
          <p>This is a placeholder for the edit lead form. The complete implementation will include a form to edit the lead.</p>
        </div>
      </div>
    </div>
  );
};

export default EditLead;