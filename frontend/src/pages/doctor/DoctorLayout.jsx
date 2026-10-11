import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { LayoutDashboard, Calendar, Clock, User, FileText } from 'lucide-react';

const DoctorLayout = () => {
  const doctorLinks = [
    { to: '/doctor', label: 'Consultations Queue', icon: LayoutDashboard, end: true },
    { to: '/doctor/availability', label: 'Availability & Slots', icon: Clock },
    { to: '/doctor/profile', label: 'Doctor Profile Settings', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar links={doctorLinks} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
