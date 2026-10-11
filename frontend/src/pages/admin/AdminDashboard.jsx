import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { INITIAL_DOCTORS, INITIAL_DEPARTMENTS, INITIAL_APPOINTMENTS } from '../../services/mockData';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState('DOCTORS');

  // New Department modal
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  useEffect(() => {
    // Doctors
    const savedDocs = JSON.parse(localStorage.getItem('careconnect_doctors') || 'null');
    if (savedDocs) {
      setDoctors(savedDocs);
    } else {
      setDoctors(INITIAL_DOCTORS);
      localStorage.setItem('careconnect_doctors', JSON.stringify(INITIAL_DOCTORS));
    }

    // Departments
    const savedDepts = JSON.parse(localStorage.getItem('careconnect_departments') || 'null');
    if (savedDepts) {
      setDepartments(savedDepts);
    } else {
      setDepartments(INITIAL_DEPARTMENTS);
      localStorage.setItem('careconnect_departments', JSON.stringify(INITIAL_DEPARTMENTS));
    }

    // Appointments
    const savedAppts = JSON.parse(localStorage.getItem('careconnect_appointments') || 'null');
    if (savedAppts) {
      setAppointments(savedAppts);
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
    }
  }, []);

  const handleUpdateDoctorStatus = (doctorId, newStatus) => {
    const updated = doctors.map((d) => (d.id === doctorId ? { ...d, status: newStatus } : d));
    setDoctors(updated);
    localStorage.setItem('careconnect_doctors', JSON.stringify(updated));
  };

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    if (!deptName) return;

    const newDept = {
      id: Date.now(),
      name: deptName,
      icon: 'Building2',
      description: deptDesc || 'Specialized clinical hospital wing'
    };

    const updated = [...departments, newDept];
    setDepartments(updated);
    localStorage.setItem('careconnect_departments', JSON.stringify(updated));
    setDeptModalOpen(false);
    setDeptName('');
    setDeptDesc('');
  };

  const pendingDoctors = doctors.filter((d) => d.status === 'PENDING');
  const approvedDoctors = doctors.filter((d) => d.status === 'APPROVED');

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              Hospital Executive Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Admin Governance & Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Oversee medical practitioners, verify licenses, manage departments, and audit clinical visits.
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

        {/* Global Hospital KPI Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Doctors</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{doctors.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{approvedDoctors.length} Active / Verified</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Pending Reviews</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingDoctors.length}</div>
            <span className="text-[11px] text-amber-600 font-semibold">Requires verification</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{appointments.length}</div>
            <span className="text-[11px] text-slate-400">System-wide logs</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Departments</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{departments.length}</div>
            <span className="text-[11px] text-purple-600 font-semibold">Active specialties</span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSection('DOCTORS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'DOCTORS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Manage Doctors & Credentials ({doctors.length})
          </button>
          <button
            onClick={() => setActiveSection('DEPARTMENTS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'DEPARTMENTS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveSection('APPOINTMENTS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'APPOINTMENTS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hospital Appointments Audit ({appointments.length})
          </button>
        </div>

        {/* SECTION 1: DOCTORS MANAGEMENT */}
        {activeSection === 'DOCTORS' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Registered Medical Doctors</h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Doctor Profile</th>
                    <th className="px-6 py-3.5">Department & Qualification</th>
                    <th className="px-6 py-3.5">Experience & Fee</th>
                    <th className="px-6 py-3.5">Approval Status</th>
                    <th className="px-6 py-3.5 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {doc.name}
                        <span className="block text-[11px] font-normal text-slate-400">{doc.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{doc.department}</span>
                        <span className="block text-[11px] text-slate-400">{doc.qualification}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{doc.experienceYears} Years</span>
                        <span className="block text-[11px] text-emerald-600 font-bold">₹{doc.consultationFee}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {doc.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateDoctorStatus(doc.id, 'APPROVED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer"
                            >
                              Approve License
                            </button>
                            <button
                              onClick={() => handleUpdateDoctorStatus(doc.id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {doc.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(doc.id, 'SUSPENDED')}
                            className="px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50 font-semibold text-[11px] cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                        {(doc.status === 'SUSPENDED' || doc.status === 'REJECTED') && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(doc.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-[11px] cursor-pointer"
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

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {doctors.map((doc) => (
                <div key={doc.id} className="p-4 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                      <span className="text-slate-400">{doc.department} • {doc.qualification}</span>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                    <span>{doc.experienceYears} Years Exp</span>
                    <span className="font-extrabold text-slate-900">Fee: ₹{doc.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {doc.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateDoctorStatus(doc.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 font-semibold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateDoctorStatus(doc.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold"
                        >
                          Approve
                        </button>
                      </>
                    )}
                    {doc.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateDoctorStatus(doc.id, 'SUSPENDED')}
                        className="px-3 py-1.5 rounded-lg text-amber-700 bg-amber-50 font-semibold"
                      >
                        Suspend Access
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: DEPARTMENTS */}
        {activeSection === 'DEPARTMENTS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{dept.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>CareConnect Wing</span>
                  <span className="text-purple-600 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 3: ALL APPOINTMENTS AUDIT */}
        {activeSection === 'APPOINTMENTS' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Hospital Appointment Audit Trail</h2>
            </div>
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
                        {appt.patientName}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {appt.doctorName}
                        <span className="block text-[11px] font-normal text-slate-400">{appt.doctorSpecialization}</span>
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
        title="Add Medical Department"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Oncology, Urology, ENT..."
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Description & Clinical Scope
            </label>
            <textarea
              rows="3"
              placeholder="Clinical facilities, disease treatments offered..."
              value={deptDesc}
              onChange={(e) => setDeptDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeptModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
