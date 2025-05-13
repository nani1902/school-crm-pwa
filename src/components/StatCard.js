import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color }) => {
  // Color classes mapping
  const colorClasses = {
    blue: 'stat-card-blue',
    green: 'stat-card-green',
    orange: 'stat-card-orange',
    red: 'stat-card-red',
    purple: 'stat-card-purple',
  };

  // Default to blue if color not specified or not found
  const colorClass = colorClasses[color] || 'stat-card-blue';

  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-icon">
        <span className="material-icons">{icon || 'insert_chart'}</span>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;