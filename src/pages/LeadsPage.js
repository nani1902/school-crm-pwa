import React from 'react';
import './LeadsPage.css';

const LeadsPage = () => {
  return (
    <div className="leads-page">
      <header className="page-header">
        <h1>Leads Management</h1>
        <button className="add-lead-btn">+ Add New Lead</button>
      </header>

      <div className="leads-container">
        <div className="filters">
          <input type="text" placeholder="Search leads..." className="search-input" />
          <select className="status-filter">
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Visit Scheduled</option>
            <option value="evaluated">Evaluated</option>
            <option value="converted">Converted</option>
          </select>
          <button className="filter-btn">Filter</button>
        </div>

        <div className="leads-list">
          <div className="lead-card">
            <h3>John Smith</h3>
            <div className="lead-status">New</div>
            <div className="lead-details">
              <p><strong>Email:</strong> john.smith@example.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Interested In:</strong> Grade 5 Admission</p>
            </div>
            <div className="lead-actions">
              <button className="view-btn">View</button>
              <button className="edit-btn">Edit</button>
            </div>
          </div>

          <div className="lead-card">
            <h3>Maria Johnson</h3>
            <div className="lead-status status-contacted">Contacted</div>
            <div className="lead-details">
              <p><strong>Email:</strong> maria.j@example.com</p>
              <p><strong>Phone:</strong> (555) 987-6543</p>
              <p><strong>Interested In:</strong> Grade 3 Admission</p>
            </div>
            <div className="lead-actions">
              <button className="view-btn">View</button>
              <button className="edit-btn">Edit</button>
            </div>
          </div>

          <div className="lead-card">
            <h3>Alex Rodriguez</h3>
            <div className="lead-status status-scheduled">Visit Scheduled</div>
            <div className="lead-details">
              <p><strong>Email:</strong> alex.r@example.com</p>
              <p><strong>Phone:</strong> (555) 456-7890</p>
              <p><strong>Interested In:</strong> Grade 1 Admission</p>
            </div>
            <div className="lead-actions">
              <button className="view-btn">View</button>
              <button className="edit-btn">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;