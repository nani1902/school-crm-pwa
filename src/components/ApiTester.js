// src/components/ApiTester.js
import React, { useState } from 'react';
import apiService, { testApiConnection } from '../api/apiService';

const ApiTester = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const testApi = async () => {
    setLoading(true);
    setTestResult('Testing API connection...');
    try {
      const result = await testApiConnection();
      setTestResult(result ? 'API connection successful! ✅' : 'API connection failed ❌');
    } catch (error) {
      setTestResult(`Error testing API: ${error.message} ❌`);
    } finally {
      setLoading(false);
    }
  };
  
  const testLoginApi = async () => {
    if (!username || !password) {
      setTestResult('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setTestResult('Testing login endpoint...');
    try {
      const result = await apiService.auth.login(username, password);
      setTestResult(`Login test result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setTestResult(`Error testing login: ${error.message} ❌`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Connection Tester</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testApi}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          Test API Connection
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
        <h3>Test Login</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        
        <button 
          onClick={testLoginApi}
          disabled={loading || !username || !password}
          style={{
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Test Login
        </button>
      </div>
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        whiteSpace: 'pre-wrap'
      }}>
        <h4>Test Results:</h4>
        {loading ? 'Loading...' : testResult ? testResult : 'No test run yet'}
      </div>
    </div>
  );
};

export default ApiTester;