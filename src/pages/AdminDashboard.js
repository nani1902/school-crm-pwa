import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Administrative Overview</h3>
        </div>
        <div className="card-body">
          <p>This is the admin dashboard where you can see an overview of the entire CRM system.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;