import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import ApiTester from './components/ApiTester';
// Layout components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/LeadsList';
import LeadDetail from './pages/LeadDetail';
import AddLead from './pages/AddLead';
import EditLead from './pages/EditLead';
import LogInteraction from './pages/LogInteraction';
import ScheduleAppointment from './pages/ScheduleAppointment';
import SubmitEvaluation from './pages/SubmitEvaluation';
import VerifyPayment from './pages/VerifyPayment';
import CompleteOnboarding from './pages/CompleteOnboarding';
import AdminUsers from './pages/AdminUsers';
import AdminPipeline from './pages/AdminPipeline';
import AdminAdmissions from './pages/AdminAdmissions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Import test api functionality (optional but useful for debugging)
import apiService from './api/apiService';

// Loading component for better UX during auth checks
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading application...</p>
  </div>
);

// Protected Route wrapper with improved error handling
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show a loader while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout wrapper with Sidebar and Navbar
const AppLayout = ({ children }) => {
  const { user, role } = useAuth();
  
  React.useEffect(() => {
    // Log user info when layout mounts - helpful for debugging
    console.log('AppLayout loaded with user:', user);
    console.log('User role:', role);
  }, [user, role]);
  
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

// Public pages that don't require layout wrapper
const PublicPage = ({ children }) => {
  return <div className="public-page">{children}</div>;
};

// Main App component
function App() {
  // Test API connection on app load to help with debugging
  React.useEffect(() => {
    const checkApi = async () => {
      try {
        if (apiService.testApiConnection) {
          const result = await apiService.testApiConnection();
          console.log('API connection test on app load:', result ? 'Success' : 'Failed');
        }
      } catch (error) {
        console.error('Error testing API on app load:', error);
      }
    };
    
    checkApi();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={
            <PublicPage>
              <Login />
            </PublicPage>
          } />
          
          <Route path="/api-test" element={
            <PublicPage>
              <ApiTester />
            </PublicPage>
          } />
          
          {/* Protected routes with layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Leads routes */}
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LeadsList />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/leads/new" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddLead />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/leads/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LeadDetail />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/leads/:id/edit" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EditLead />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/leads/:id/log" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LogInteraction />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/leads/:id/schedule" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ScheduleAppointment />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Teacher routes */}
          <Route 
            path="/evaluations/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SubmitEvaluation />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Office desk routes */}
          <Route 
            path="/verify-payment/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <VerifyPayment />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complete-onboarding/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CompleteOnboarding />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminUsers />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/pipeline" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminPipeline />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/admissions" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminAdmissions />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Analytics routes */}
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* User profile & settings */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found route */}
          <Route 
            path="*" 
            element={
              <PublicPage>
                <NotFound />
              </PublicPage>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;