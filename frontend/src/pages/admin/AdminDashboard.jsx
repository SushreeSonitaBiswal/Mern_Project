import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Building2, 
  Plus, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { adminService } from '../../services';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalAppointments: 0, totalDepartments: 0 });
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('DOCTORS');

  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, docRes, apptRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllDoctors(),
        adminService.getAllAppointments()
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (docRes?.data) setDoctors(docRes.data);
      if (apptRes?.data) setAppointments(apptRes.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateDoctorStatus = async (doctorId, newStatus) => {
    try {
      await adminService.updateDoctorStatus(doctorId, newStatus);
      fetchAdminData();
    } catch (err) {
      alert(err?.message || 'Failed to update doctor status');
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!deptName) return;

    try {
      await adminService.createDepartment({
        name: deptName,
        description: deptDesc,
        iconName: 'Building2'
      });
      setDeptModalOpen(false);
      setDeptName('');
      setDeptDesc('');
      fetchAdminData();
    } catch (err) {
      alert(err?.message || 'Failed to create department');
    }
  };

  const pendingDoctors = doctors.filter((d) => d.status === 'PENDING');
  const approvedDoctors = doctors.filter((d) => d.status === 'APPROVED');

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              Hospital Executive Control Center (Live Database)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Admin Governance & Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time monitoring of doctors, departments, and hospital appointments from Supabase PostgreSQL.
            </p>
          </div>
          <button
            onClick={() => setDeptModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Doctors</span>
              <Stethoscope className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{doctors.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{approvedDoctors.length} Active / Verified</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Pending Reviews</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingDoctors.length}</div>
            <span className="text-[11px] text-amber-600 font-semibold">Requires verification</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Bookings</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{appointments.length}</div>
            <span className="text-[11px] text-slate-400">Database recorded</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Departments</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalDepartments}</div>
            <span className="text-[11px] text-purple-600 font-semibold">Active specialties</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSection('DOCTORS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'DOCTORS' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Manage Doctors & Credentials ({doctors.length})
          </button>
          <button
            onClick={() => setActiveSection('APPOINTMENTS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'APPOINTMENTS' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hospital Appointments Audit ({appointments.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-xs">Fetching live administrative data...</span>
          </div>
        ) : activeSection === 'DOCTORS' ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Doctor Profile</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5">Experience & Fee</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {doc.name}
                        <span className="block text-[11px] font-normal text-slate-400">{doc.user?.email || doc.phone}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{doc.department?.name || doc.specialization}</span>
                        <span className="block text-[11px] text-slate-400">{doc.qualification}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span>{doc.experienceYears || 5} Years</span>
                        <span className="block text-[11px] text-emerald-600 font-bold">₹{doc.consultationFee}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {doc.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(doc.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {doc.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(doc.id, 'SUSPENDED')}
                            className="px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50 font-semibold text-[11px]"
                          >
                            Suspend
                          </button>
                        )}
                        {doc.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(doc.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-[11px]"
                          >
                            Reinstate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Patient</th>
                    <th className="px-6 py-3.5">Doctor</th>
                    <th className="px-6 py-3.5">Date & Slot</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {appt.patient?.name || 'Patient'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {appt.doctor?.name || 'Doctor'}
                      </td>
                      <td className="px-6 py-4">
                        {appt.appointmentDate} at {appt.appointmentTime}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={appt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={deptModalOpen}
        onClose={() => setDeptModalOpen(false)}
        title="Add Hospital Medical Department"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Oncology, ENT, Urology..."
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Clinical overview..."
              value={deptDesc}
              onChange={(e) => setDeptDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeptModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold"
            >
              Create in Database
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
