import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Trash2, 
  Filter 
} from 'lucide-react';
import { INITIAL_DOCTORS } from '../../services/mockData';
import StatusBadge from '../../components/common/StatusBadge';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('careconnect_doctors') || 'null');
    setDoctors(saved || INITIAL_DOCTORS);
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = doctors.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
    setDoctors(updated);
    localStorage.setItem('careconnect_doctors', JSON.stringify(updated));
  };

  const filtered = doctors.filter((d) => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Medical Doctors</h1>
          <p className="text-xs text-slate-500">Verify licenses, approve new practitioner applications, and manage hospital permissions</p>
        </div>
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
                    <span className="block text-[11px] font-normal text-slate-400">{doc.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{doc.department}</span>
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
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(doc.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 font-semibold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {doc.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(doc.id, 'SUSPENDED')}
                        className="px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50 font-semibold text-[11px]"
                      >
                        Suspend
                      </button>
                    )}
                    {doc.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleUpdateStatus(doc.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 font-semibold text-[11px]"
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
    </div>
  );
};

export default ManageDoctors;
