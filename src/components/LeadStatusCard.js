// src/components/LeadStatusCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LeadStatusCard.css';

const LeadStatusCard = ({ title, leads, status, color, icon }) => {
  return (
    <div className={`lead-status-card ${color || 'primary'}`}>
      <div className="card-header">
        <h3>
          {icon && <span className="material-icons">{icon}</span>}
          {title}
        </h3>
        <span className="badge">{leads ? leads.length : 0}</span>
      </div>
      <div className="card-body">
        {leads && leads.length > 0 ? (
          <ul className="leads-list">
            {leads.map(lead => (
              <li key={lead.id} className="lead-item">
                <div className="lead-info">
                  <Link to={`/leads/${lead.id}`} className="lead-name">
                    {lead.full_name}
                  </Link>
                  <div className="lead-details">
                    {lead.phone_number && <div>{lead.phone_number}</div>}
                    {lead.email && <div>{lead.email}</div>}
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
            <span className="material-icons">info</span>
            No leads in this status.
          </p>
        )}
      </div>
    </div>
  );
};

export default LeadStatusCard;
// This code defines a React component called `LeadStatusCard`.
// The component is designed to display a card that summarizes leads based on their status.
// It accepts several props:
// - `title`: The title of the card.
// - `leads`: An array of lead objects to be displayed in the card.
// - `status`: The status of the leads (not used in the current implementation).
// - `color`: The color of the card (default is 'primary').
// - `icon`: An optional icon to be displayed next to the title.
//
// The component uses Bootstrap classes for styling and layout.
// It includes a header with the title and a badge showing the number of leads.
// The body of the card contains a list of leads, each with a link to view more details.
// If there are no leads, a message is displayed indicating that there are no leads in this status.
// The component is exported as the default export, making it available for use in other parts of the application.
// The component is styled using CSS classes defined in the `LeadStatusCard.css` file.
// The component uses the `Link` component from React Router to create links to the lead details page.
// The component is structured to be reusable and can be used in different parts of the application where lead status information is needed.