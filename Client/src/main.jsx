import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthRoute from './components/AuthRoute';
import App from "./App"; 
import FlexoraAuth from "./pages/auth/Flexoraauth";
import UserProfilePage from "./components/Userprofile";
import About from "./components/About";
import Jobs from "./pages/jobs/Jobs";
import PostJob from "./pages/jobs/Postjobs";
import MyJobs from "./pages/jobs/MyJobs";
import Applicants from "./pages/jobs/Applicants";
import MyApplications from "./pages/jobs/MyApplications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApprovalQueue from "./pages/admin/ApprovalQueue";
import JobManagement from "./pages/admin/JobManagement";
import ModerationCenter from "./pages/admin/ModerationCenter";
import UserManagement from "./pages/admin/UserManagement";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              borderRadius: '16px'
            }
          }}
        />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/flexoraauth" element={<FlexoraAuth />} />
          
          {/* Protected routes */}
          <Route path="/userprofile" element={
            <AuthRoute>
              <UserProfilePage />
            </AuthRoute>
          } />
          <Route path="/my-jobs" element={
            <AuthRoute requiredRole="job_provider">
              <MyJobs />
            </AuthRoute>
          } />
          <Route path="/jobs/:id/applicants" element={
            <AuthRoute requiredRole="job_provider">
              <Applicants />
            </AuthRoute>
          } />
          <Route path="/my-applications" element={
            <AuthRoute>
              <MyApplications />
            </AuthRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/flexora-admin" element={
            <AuthRoute requiredRole="admin">
              <AdminDashboard />
            </AuthRoute>
          }>
            <Route path="jobs" element={<JobManagement />} />
            <Route path="approvals" element={<ApprovalQueue />} />
            <Route path="moderation" element={<ModerationCenter />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/homepage" element={<Navigate to="/" replace />} />
          <Route path="/landingpage" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);