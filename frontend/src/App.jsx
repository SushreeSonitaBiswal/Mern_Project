import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import ProtectedRoute from './routes/ProtectedRoute';

const PatientDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-slate-800">Patient Dashboard</h1>
    <p className="text-slate-500 mt-2">Manage appointments and view medical records.</p>
  </div>
);

const DoctorDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
    <p className="text-slate-500 mt-2">View consultations, update schedules, and prescribe medication.</p>
  </div>
);

const AdminDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-slate-800">Admin Control Center</h1>
    <p className="text-slate-500 mt-2">Manage doctors, departments, and inspect hospital metrics.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/doctors" element={<Home />} />

              {/* Patient Routes */}
              <Route
                path="/patient/*"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
