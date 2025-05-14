import React, { useEffect } from 'react';

const DjangoAdmin = () => {
  useEffect(() => {
    // Redirect to the Django admin site
    window.location.href = 'http://mahesh1902.pythonanywhere.com/admin/';
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Redirecting to Django Admin</h1>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p>You are being redirected to the Django Admin interface. If you are not redirected automatically, 
            <a href="http://mahesh1902.pythonanywhere.com/admin/" target="_blank" rel="noopener noreferrer">click here</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default DjangoAdmin;