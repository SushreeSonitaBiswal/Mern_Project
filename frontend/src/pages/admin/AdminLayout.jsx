import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { LayoutDashboard, Users, Stethoscope, Building2, BarChart3 } from 'lucide-react';

const AdminLayout = () => {
  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patient Registry', icon: Users },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar links={adminLinks} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
