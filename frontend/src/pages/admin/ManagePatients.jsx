import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin, Calendar, Heart, Loader2 } from 'lucide-react';
import { patientService } from '../../services';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await patientService.getAllPatients();
        if (res?.data) {
          setPatients(res.data);
        }
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Patient Directory</h1>
          <p className="text-xs text-slate-500">Registry of registered patients, emergency contacts, and consultation history</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-xs">Loading patient registry...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No patients found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Blood Group & Gender</th>
                  <th className="px-6 py-3.5">Address / Region</th>
                  <th className="px-6 py-3.5 text-right">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((pt) => (
                  <tr key={pt.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {pt.name}
                      <span className="block text-[11px] font-normal text-slate-400">ID: #PT-10{pt.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span>{pt.user?.email || pt.email || 'Registered User'}</span>
                      <span className="block text-[11px] text-slate-400">{pt.phone || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">{pt.bloodGroup || 'O+'}</span>
                      <span className="ml-2 text-slate-400">{pt.gender || 'Not specified'}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {pt.address || 'Bhubaneswar, India'}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium">
                      {pt.emergencyContact || 'Not recorded'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePatients;
