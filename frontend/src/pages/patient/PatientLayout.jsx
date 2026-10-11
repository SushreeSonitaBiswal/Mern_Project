import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { LayoutDashboard, Calendar, FileText, User } from 'lucide-react';

const PatientLayout = () => {
  const patientLinks = [
    { to: '/patient', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
    { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { to: '/patient/medical-history', label: 'Medical History & Rx', icon: FileText },
    { to: '/patient/profile', label: 'Personal Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar links={patientLinks} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
