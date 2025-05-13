// src/components/ErrorAlert.js
import React from 'react';
import './ErrorAlert.css';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="error-alert">
      <div className="error-icon">
        <span className="material-icons">error_outline</span>
      </div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          <span className="material-icons">refresh</span>
          <span className="btn-text">Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;