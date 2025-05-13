import React from 'react';
import { Link } from 'react-router-dom';

const AddLead = () => {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Add New Lead</h1>
        <div className="header-actions">
          <Link to="/leads" className="btn btn-outline-secondary">
            <span className="material-icons">arrow_back</span>
            <span className="btn-text">Back to Leads</span>
          </Link>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Lead Information</h3>
        </div>
        <div className="card-body">
          <p>This is a placeholder for the add lead form. The complete implementation will include a form to add a new lead.</p>
        </div>
      </div>
    </div>
  );
};

export default AddLead;