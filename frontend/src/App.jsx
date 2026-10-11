import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import FindDoctors from './pages/public/FindDoctors';
import DoctorProfile from './pages/public/DoctorProfile';
import NotFound from './pages/public/NotFound';

// Patient Pages
import PatientLayout from './pages/patient/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientMedicalHistory from './pages/patient/PatientMedicalHistory';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorLayout from './pages/doctor/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAvailabilityPage from './pages/doctor/DoctorAvailabilityPage';
import DoctorProfileSettings from './pages/doctor/DoctorProfileSettings';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import ManageDepartments from './pages/admin/ManageDepartments';
import SystemReports from './pages/admin/SystemReports';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<FindDoctors />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />

              {/* Patient Workspace (Protected) */}
              <Route
                path="/patient"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                    <PatientLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<PatientDashboard />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="medical-history" element={<PatientMedicalHistory />} />
                <Route path="profile" element={<PatientProfile />} />
              </Route>

              {/* Doctor Workspace (Protected) */}
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                    <DoctorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DoctorDashboard />} />
                <Route path="availability" element={<DoctorAvailabilityPage />} />
                <Route path="profile" element={<DoctorProfileSettings />} />
              </Route>

              {/* Admin Control Center (Protected) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="home" element={<AdminDashboard />} />
                <Route path="doctors" element={<ManageDoctors />} />
                <Route path="patients" element={<ManagePatients />} />
                <Route path="departments" element={<ManageDepartments />} />
                <Route path="reports" element={<SystemReports />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <footer className="bg-white border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>© 2026 CareConnect Healthcare System. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span>Enterprise Grade</span>
                <span>•</span>
                <span>HIPAA & Privacy Ready</span>
                <span>•</span>
                <span>Spring Boot & React</span>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
