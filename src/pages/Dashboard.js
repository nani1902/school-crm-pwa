// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useDashboard from '../hooks/useDashboard';
import './Dashboard.css';

// Components
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const Dashboard = () => {
  const { role } = useAuth();
  const { data: dashboardData, isLoading, error, refetch } = useDashboard();

  // Render appropriate content based on loading and error states
  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorAlert message="Failed to load dashboard data. Please try again later." onRetry={refetch} />;
  }

  // Render different dashboards based on user role
  const renderDashboardContent = () => {
    // Admin dashboard
    if (role === 'Admin') {
      return (
        <>
          <div className="stats-grid">
            <StatCard 
              title="New Leads" 
              value={dashboardData.new_leads_count || 0}
              icon="person_add"
              color="blue"
            />
            <StatCard 
              title="In Progress" 
              value={dashboardData.progressed_leads_count || 0}
              icon="pending_actions"
              color="orange"
            />
            <StatCard 
              title="Admissions" 
              value={dashboardData.admissions_count || 0}
              icon="school"
              color="green"
            />
            <StatCard 
              title="Active Users" 
              value={dashboardData.active_users_count || 0}
              icon="people"
              color="purple"
            />
          </div>

          {/* Lead alerts sections */}
          <div className="dashboard-alerts">
            {/* Unassigned Leads Card */}
            <div className="dashboard-card">
              <div className="card-header danger">
                <h3>
                  <span className="material-icons">warning</span>
                  Leads Needing Assignment
                </h3>
                <span className="badge">{dashboardData.leads_needing_assignment?.length || 0}</span>
              </div>
              <div className="card-body">
                {dashboardData.leads_needing_assignment?.length > 0 ? (
                  <ul className="leads-list">
                    {dashboardData.leads_needing_assignment.map(lead => (
                      <li key={lead.id} className="lead-item">
                        <div className="lead-info">
                          <Link to={`/leads/${lead.id}`} className="lead-name">
                            {lead.full_name}
                          </Link>
                          <div className="lead-details">
                            <span>{lead.date_of_enquiry}</span>
                            <span>{lead.area_of_residence || 'No area specified'}</span>
                          </div>
                        </div>
                        <Link to={`/assign-lead/${lead.id}`} className="btn btn-sm btn-warning">
                          <span className="material-icons">person_add</span>
                          <span className="btn-text">Assign</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">
                    <span className="material-icons">check_circle</span>
                    No leads currently require manual assignment.
                  </p>
                )}
              </div>
            </div>

            {/* Not Contacted Leads Card */}
            <div className="dashboard-card">
              <div className="card-header warning">
                <h3>
                  <span className="material-icons">schedule</span>
                  Leads Not Contacted Today
                </h3>
                <span className="badge">{dashboardData.leads_not_contacted?.length || 0}</span>
              </div>
              <div className="card-body">
                {dashboardData.leads_not_contacted?.length > 0 ? (
                  <ul className="leads-list">
                    {dashboardData.leads_not_contacted.map(lead => (
                      <li key={lead.id} className="lead-item">
                        <div className="lead-info">
                          <Link to={`/leads/${lead.id}`} className="lead-name">
                            {lead.full_name}
                          </Link>
                          <div className="lead-details">
                            <span>Assigned: {lead.assigned_counselor?.username || 'None'}</span>
                            <span>Last contact: {lead.last_contact_date || 'Never'}</span>
                          </div>
                        </div>
                        <Link to={`/leads/${lead.id}`} className="btn btn-sm btn-primary">
                          <span className="material-icons">visibility</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">
                    <span className="material-icons">check_circle</span>
                    No assigned leads require contact follow-up today.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }
    
    // Coordinator dashboard
    if (role === 'Admission Coordinator') {
      return (
        <>
          <div className="stats-grid">
            <StatCard 
              title="My Active Leads" 
              value={dashboardData.my_leads_count || 0}
              icon="people"
              color="blue"
            />
            <StatCard 
              title="Appointments Today" 
              value={dashboardData.appointments_today?.length || 0}
              icon="event"
              color="orange"
            />
            <StatCard 
              title="Follow-ups Due" 
              value={dashboardData.follow_ups_due?.length || 0}
              icon="notification_important"
              color="red"
            />
          </div>

          {/* Assigned Leads Section */}
          {dashboardData.my_leads?.length > 0 ? (
            <div className="dashboard-card">
              <div className="card-header primary">
                <h3>
                  <span className="material-icons">assignment_ind</span>
                  My Assigned Leads
                </h3>
                <Link to="/leads" className="btn btn-sm btn-primary">
                  <span className="material-icons">visibility</span>
                  <span className="btn-text">View All</span>
                </Link>
              </div>
              <div className="card-body">
                <ul className="leads-list">
                  {dashboardData.my_leads.slice(0, 5).map(lead => (
                    <li key={lead.id} className="lead-item">
                      <div className="lead-info">
                        <Link to={`/leads/${lead.id}`} className="lead-name">
                          {lead.full_name}
                        </Link>
                        <div className="lead-meta">
                          <span className={`status-badge ${lead.status.toLowerCase()}`}>
                            {lead.status_display}
                          </span>
                        </div>
                        <div className="lead-details">
                          <span>Class: {lead.interested_class || 'N/A'}</span>
                          <span>Last Contact: {lead.last_contact_date || 'None'}</span>
                        </div>
                      </div>
                      <div className="lead-actions">
                        <Link to={`/leads/${lead.id}`} className="btn btn-sm btn-outline-primary">
                          <span className="material-icons">visibility</span>
                        </Link>
                        <Link to={`/leads/${lead.id}/log`} className="btn btn-sm btn-outline-info">
                          <span className="material-icons">add_comment</span>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="dashboard-card">
              <div className="card-body">
                <p className="empty-message">
                  <span className="material-icons">info</span>
                  You currently have no assigned leads.
                </p>
                <div className="text-center">
                  <Link to="/leads/new" className="btn btn-primary">
                    <span className="material-icons">add</span>
                    Add New Lead
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Appointments Section */}
          {dashboardData.appointments_today?.length > 0 && (
            <div className="dashboard-card">
              <div className="card-header warning">
                <h3>
                  <span className="material-icons">today</span>
                  Today's Appointments
                </h3>
              </div>
              <div className="card-body">
                <ul className="appointments-list">
                  {dashboardData.appointments_today.map(appointment => (
                    <li key={appointment.id} className="appointment-item">
                      <div className="appointment-time">
                        {appointment.appointment_time}
                      </div>
                      <div className="appointment-info">
                        <Link to={`/leads/${appointment.lead.id}`} className="appointment-name">
                          {appointment.lead.full_name}
                        </Link>
                        <div className="appointment-details">
                          <span>Phone: {appointment.lead.phone_number || 'N/A'}</span>
                          {appointment.notes && (
                            <span className="appointment-notes">{appointment.notes}</span>
                          )}
                        </div>
                      </div>
                      <div className="appointment-actions">
                        <Link to={`/leads/${appointment.lead.id}`} className="btn btn-sm btn-outline-primary">
                          <span className="material-icons">visibility</span>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      );
    }
    
    // Teacher dashboard
    if (role === 'Teaching Coordinator') {
      return (
        <div className="dashboard-card">
          <div className="card-header primary">
            <h3>
              <span className="material-icons">assignment</span>
              My Evaluation Queue
            </h3>
          </div>
          <div className="card-body">
            {dashboardData.pending_evaluations?.length > 0 ? (
              <ul className="leads-list">
                {dashboardData.pending_evaluations.map(lead => (
                  <li key={lead.id} className="lead-item">
                    <div className="lead-info">
                      <Link to={`/leads/${lead.id}`} className="lead-name">
                        {lead.full_name}
                      </Link>
                      <div className="lead-details">
                        <span>Interested Class: {lead.interested_class || 'N/A'}</span>
                        <span>Assigned On: {lead.updated_at}</span>
                      </div>
                    </div>
                    <Link to={`/evaluations/${lead.id}`} className="btn btn-sm btn-warning">
                      <span className="material-icons">rate_review</span>
                      <span className="btn-text">Evaluate</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">
                <span className="material-icons">check_circle</span>
                You have no leads currently pending evaluation.
              </p>
            )}
          </div>
        </div>
      );
    }
    
    // Principal dashboard
    if (role === 'Principal') {
      return (
        <div className="dashboard-card">
          <div className="card-header primary">
            <h3>
              <span className="material-icons">approval</span>
              Leads Awaiting Approval
            </h3>
          </div>
          <div className="card-body">
            {dashboardData.pending_approvals?.length > 0 ? (
              <ul className="leads-list">
                {dashboardData.pending_approvals.map(lead => (
                  <li key={lead.id} className="lead-item">
                    <div className="lead-info">
                      <Link to={`/leads/${lead.id}`} className="lead-name">
                        {lead.full_name}
                      </Link>
                      <div className="lead-details">
                        <span>Interested Class: {lead.interested_class || 'N/A'}</span>
                        <span>Evaluating Teacher: {lead.evaluating_teacher?.username || 'N/A'}</span>
                      </div>
                    </div>
                    <Link to={`/review-evaluation/${lead.id}`} className="btn btn-sm btn-primary">
                      <span className="material-icons">visibility</span>
                      <span className="btn-text">Review</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">
                <span className="material-icons">check_circle</span>
                There are no leads currently awaiting your approval.
              </p>
            )}
          </div>
        </div>
      );
    }
    
    // Office desk dashboard
    if (role === 'Office Desk') {
      return (
        <>
          <div className="dashboard-card">
            <div className="card-header warning">
              <h3>
                <span className="material-icons">payments</span>
                Leads Pending Payment Verification
              </h3>
            </div>
            <div className="card-body">
              {dashboardData.pending_payments?.length > 0 ? (
                <ul className="leads-list">
                  {dashboardData.pending_payments.map(lead => (
                    <li key={lead.id} className="lead-item">
                      <div className="lead-info">
                        <Link to={`/leads/${lead.id}`} className="lead-name">
                          {lead.full_name}
                        </Link>
                        <div className="lead-details">
                          <span>Parent: {lead.parent_name || 'N/A'}</span>
                          <span>Phone: {lead.phone_number || 'N/A'}</span>
                          <span>Class: {lead.interested_class || 'N/A'}</span>
                        </div>
                      </div>
                      <Link to={`/verify-payment/${lead.id}`} className="btn btn-sm btn-success">
                        <span className="material-icons">verified</span>
                        <span className="btn-text">Verify Payment</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">
                  <span className="material-icons">check_circle</span>
                  No leads are currently pending payment verification.
                </p>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header success">
              <h3>
                <span className="material-icons">how_to_reg</span>
                Leads Ready for Onboarding
              </h3>
            </div>
            <div className="card-body">
              {dashboardData.ready_for_onboarding?.length > 0 ? (
                <ul className="leads-list">
                  {dashboardData.ready_for_onboarding.map(lead => (
                    <li key={lead.id} className="lead-item">
                      <div className="lead-info">
                        <Link to={`/leads/${lead.id}`} className="lead-name">
                          {lead.full_name}
                        </Link>
                        <div className="lead-details">
                          <span>Parent: {lead.parent_name || 'N/A'}</span>
                          <span>Phone: {lead.phone_number || 'N/A'}</span>
                          <span>Class: {lead.interested_class || 'N/A'}</span>
                        </div>
                      </div>
                      <Link to={`/complete-onboarding/${lead.id}`} className="btn btn-sm btn-info">
                        <span className="material-icons">school</span>
                        <span className="btn-text">Complete Onboarding</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">
                  <span className="material-icons">check_circle</span>
                  No leads are currently ready for onboarding.
                </p>
              )}
            </div>
          </div>
        </>
      );
    }
    
    // Fallback for unknown roles
    return (
      <div className="dashboard-card">
        <div className="card-body">
          <p className="empty-message">
            <span className="material-icons">info</span>
            Welcome to the School CRM system.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <Link to="/leads/new" className="btn btn-primary">
            <span className="material-icons">add</span>
            <span className="btn-text">Add New Lead</span>
          </Link>
          <button 
            onClick={() => refetch()} 
            className="btn btn-outline-secondary"
            title="Refresh dashboard data"
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;