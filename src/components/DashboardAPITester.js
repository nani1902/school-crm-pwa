// src/components/DashboardAPITester.js
import React, { useState } from 'react';
import { dashboardAPI } from '../api/apiService';

const DashboardAPITester = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState(false);

  const testDashboardAPI = async () => {
    setLoading(true);
    try {
      const data = await dashboardAPI.getDashboardData();
      setApiResponse(data);
      console.log('API tester response:', data);
    } catch (error) {
      console.error('API test error:', error);
      setApiResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #eee', 
      borderRadius: '8px',
      marginTop: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginBottom: '15px' }}>Dashboard API Tester (Dev Only)</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={testDashboardAPI}
          disabled={loading}
          style={{
            padding: '8px 15px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? 'Loading...' : 'Test Dashboard API'}
        </button>
        <button
          onClick={() => setRawResponse(!rawResponse)}
          style={{
            padding: '8px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {rawResponse ? 'Show Specific Data' : 'Show Raw Response'}
        </button>
      </div>

      {apiResponse && (
        <div>
          {rawResponse ? (
            <div>
              <h4>Raw API Response:</h4>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '400px'
              }}>
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          ) : (
            <>
              <div style={{ marginTop: '10px' }}>
                <h4>Leads Needing Assignment:</h4>
                {apiResponse.leads_needing_assignment ? (
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}>
                    {JSON.stringify(apiResponse.leads_needing_assignment, null, 2)}
                  </pre>
                ) : (
                  <div style={{ color: 'red', padding: '10px', background: '#fff3f3', borderRadius: '4px' }}>
                    <strong>Error:</strong> 'leads_needing_assignment' property is missing from API response.
                    This could indicate a backend issue or API mismatch.
                  </div>
                )}
              </div>
              <div style={{ marginTop: '10px' }}>
                <h4>Leads Not Contacted:</h4>
                {apiResponse.leads_not_contacted ? (
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}>
                    {JSON.stringify(apiResponse.leads_not_contacted, null, 2)}
                  </pre>
                ) : (
                  <div style={{ color: 'red', padding: '10px', background: '#fff3f3', borderRadius: '4px' }}>
                    <strong>Error:</strong> 'leads_not_contacted' property is missing from API response.
                    This could indicate a backend issue or API mismatch.
                  </div>
                )}
              </div>
              <div style={{ marginTop: '20px' }}>
                <h4>Missing Fields:</h4>
                <div style={{ padding: '10px', background: '#fff8e6', borderRadius: '4px' }}>
                  {[
                    'leads_needing_assignment',
                    'leads_not_contacted',
                    'my_leads',
                    'follow_ups_due',
                    'appointments_today',
                    'pending_evaluations',
                    'pending_approvals',
                    'pending_payments',
                    'ready_for_onboarding'
                  ].filter(field => !apiResponse[field]).map(field => (
                    <div key={field} style={{ marginBottom: '5px' }}>
                      <strong>{field}</strong> - Expected but missing from API response
                    </div>
                  ))}
                  {Object.keys(apiResponse).filter(key => !['new_leads_count', 'progressed_leads_count', 'admissions_count', 'active_users_count', 'conversion_rate', 'recent_activities'].includes(key)).length === 0 && (
                    <div>Only basic statistics present. All dashboard-specific fields are missing.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardAPITester;