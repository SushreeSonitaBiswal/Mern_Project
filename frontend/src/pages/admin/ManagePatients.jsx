import React, { useState } from 'react';
import { Users, Search, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react';

const ManagePatients = () => {
  const [patients] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@careconnect.com', phone: '+91 98111 22233', bloodGroup: 'O+', gender: 'Male', totalVisits: 3, lastVisit: '2026-10-08' },
    { id: 2, name: 'Pooja Das', email: 'pooja.das@gmail.com', phone: '+91 98333 44455', bloodGroup: 'B+', gender: 'Female', totalVisits: 1, lastVisit: '2026-10-11' },
    { id: 3, name: 'Amit Verma', email: 'amit.verma@gmail.com', phone: '+91 98444 55566', bloodGroup: 'A+', gender: 'Male', totalVisits: 2, lastVisit: '2026-09-28' },
    { id: 4, name: 'Sunita Mishra', email: 'sunita.m@gmail.com', phone: '+91 98555 66677', bloodGroup: 'AB+', gender: 'Female', totalVisits: 4, lastVisit: '2026-10-02' }
  ]);
  const [search, setSearch] = useState('');

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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Patient Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Blood Group & Gender</th>
                <th className="px-6 py-3.5">Consultations</th>
                <th className="px-6 py-3.5 text-right">Last Visit</th>
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
                    <span>{pt.email}</span>
                    <span className="block text-[11px] text-slate-400">{pt.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">{pt.bloodGroup}</span>
                    <span className="ml-2 text-slate-400">{pt.gender}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {pt.totalVisits} Consultations
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {pt.lastVisit}
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

export default ManagePatients;
