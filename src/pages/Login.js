// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed useLocation since it's not used
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Removed location since it's not being used
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard if already logged in
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted via React handler');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log(`Attempting to login with username: ${username}`);
      const result = await login(username, password);
      
      if (result.success) {
        console.log('Login successful, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.error('Login failed:', result.message);
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>School CRM</h2>
          <p>Login to your account</p>
        </div>
        
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="/api-test" className="test-link">Test API Connection</a>
        </div>
      </div>
    </div>
  );
};

export default Login;