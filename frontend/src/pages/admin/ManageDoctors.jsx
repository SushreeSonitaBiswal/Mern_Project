import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Trash2, 
  Filter,
  Plus,
  Loader2
} from 'lucide-react';
import { adminService, departmentService } from '../../services';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 800,
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const [docRes, deptRes] = await Promise.all([
        adminService.getAllDoctors(),
        departmentService.getAllDepartments()
      ]);
      if (docRes?.data) setDoctors(docRes.data);
      if (deptRes?.data) setDepartments(deptRes.data);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createDoctor({
        ...formData,
        experienceYears: Number(formData.experienceYears),
        consultationFee: Number(formData.consultationFee),
        departmentId: formData.departmentId ? Number(formData.departmentId) : null
      });
      alert('Doctor onboarded and approved successfully!');
      setModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        departmentId: '',
        specialization: '',
        qualification: '',
        experienceYears: 5,
        consultationFee: 800,
        bio: ''
      });
      fetchDoctors();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to onboard doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminService.updateDoctorStatus(id, newStatus);
      fetchDoctors();
    } catch (err) {
      alert(err?.message || 'Failed to update doctor status');
    }
  };

  const filtered = doctors.filter((d) => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesSearch = 
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.specialization || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Medical Doctors</h1>
          <p className="text-xs text-slate-500">Verify licenses, approve new practitioner applications, and onboard medical staff</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Onboard New Doctor
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'PENDING', 'APPROVED', 'SUSPENDED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === s ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-xs">Loading medical practitioners...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No doctors found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Doctor Name</th>
                  <th className="px-6 py-3.5">Specialty</th>
                  <th className="px-6 py-3.5">Experience & Fee</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {doc.name}
                      <span className="block text-[11px] font-normal text-slate-400">{doc.user?.email || doc.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{doc.department?.name || doc.specialization}</span>
                      <span className="block text-[11px] text-slate-400">{doc.qualification}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span>{doc.experienceYears} Years</span>
                      <span className="block text-[11px] text-emerald-600 font-bold">₹{doc.consultationFee}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {doc.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(doc.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(doc.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 font-semibold text-[11px] cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {doc.status === 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(doc.id, 'SUSPENDED')}
                          className="px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50 font-semibold text-[11px] cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                      {doc.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleUpdateStatus(doc.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 font-semibold text-[11px] cursor-pointer"
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
        )}
      </div>

      {/* Onboard New Doctor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Onboard & Approve Medical Doctor"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Doctor Full Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. S. K. Mohapatra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Official Email *</label>
              <input
                type="email"
                required
                placeholder="doctor@careconnect.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Initial Password *</label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="">Select Clinical Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Specialization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cardiologist, Neurologist"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Qualification *</label>
              <input
                type="text"
                required
                placeholder="MBBS, MD (Medicine), DM"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                min="100"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Professional Bio</label>
            <textarea
              rows="2"
              placeholder="Clinical achievements, certifications, past hospital affiliations..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Creating Doctor...' : 'Onboard & Approve'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
