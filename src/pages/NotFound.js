import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <span className="material-icons">home</span>
          <span className="btn-text">Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
// This code defines a React component for the "Not Found" page.
// It uses React Router's `Link` component to provide a button that navigates back to the home page.
// The component is styled using Bootstrap classes for layout and design.
// The main content of the page includes a large "404" message, a subtitle indicating that the page was not found, and a brief message explaining the issue.
// The component is exported as the default export of the module, making it available for use in other parts of the application.