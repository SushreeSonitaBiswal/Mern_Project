import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, Ban, Star, Search } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { INITIAL_APPOINTMENTS, INITIAL_PRESCRIPTIONS } from '../../services/mockData';
import Modal from '../../components/common/Modal';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('careconnect_appointments') || 'null');
    setAppointments(saved || INITIAL_APPOINTMENTS);
  }, []);

  const handleCancel = (id) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a));
    setAppointments(updated);
    localStorage.setItem('careconnect_appointments', JSON.stringify(updated));
  };

  const filtered = appointments.filter((a) => {
    const matchesFilter = filter === 'ALL' || a.status === filter;
    const matchesSearch = 
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorSpecialization.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-xs text-slate-500">Track and manage all your historical and upcoming doctor visits</p>
        </div>
        <Link
          to="/doctors"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          + Book New Slot
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto overflow-x-auto">
          {['ALL', 'CONFIRMED', 'REQUESTED', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === s ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No appointments found matching current filters.
          </div>
        ) : (
          filtered.map((appt) => (
            <div key={appt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{appt.doctorName}</h3>
                  <StatusBadge status={appt.status} />
                </div>
                <p className="text-xs text-slate-500">{appt.doctorSpecialization}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {appt.appointmentDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {appt.appointmentTime}
                  </span>
                </div>
                {appt.symptoms && (
                  <p className="text-[11px] text-slate-400 italic">"{appt.symptoms}"</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {appt.status === 'COMPLETED' && (
                  <button
                    onClick={() => setSelectedPrescription(INITIAL_PRESCRIPTIONS[appt.id] || INITIAL_PRESCRIPTIONS[102])}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Prescription
                  </button>
                )}
                {(appt.status === 'CONFIRMED' || appt.status === 'REQUESTED') && (
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prescription Modal */}
      <Modal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        title="Consultation Prescription (Rx)"
      >
        {selectedPrescription && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900">{selectedPrescription.doctorName}</h4>
              <p className="text-slate-500">{selectedPrescription.doctorSpecialization}</p>
              <p className="text-[11px] text-slate-400">Date: {selectedPrescription.date}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block">Diagnosis:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{selectedPrescription.diagnosis}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block mb-1">Medicines:</span>
              <div className="space-y-1.5">
                {selectedPrescription.medicines.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="font-bold text-slate-800">{m.name}</span>
                    <span className="text-slate-500">{m.dosage} • {m.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block">Advice:</span>
              <p className="text-slate-600 italic mt-0.5">{selectedPrescription.advice}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientAppointments;
