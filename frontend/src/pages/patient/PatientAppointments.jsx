import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, Search, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentService } from '../../services';
import Modal from '../../components/common/Modal';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments();
      if (res?.data) setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await appointmentService.updateStatus(id, 'CANCELLED');
      fetchAppointments();
    } catch (err) {
      alert(err?.message || 'Failed to cancel appointment');
    }
  };

  const handleOpenPrescription = async (id) => {
    try {
      const res = await appointmentService.getPrescription(id);
      if (res?.data) setSelectedPrescription(res.data);
    } catch (err) {
      alert('Prescription not yet uploaded for this visit.');
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesFilter = filter === 'ALL' || a.status === filter;
    const docName = a.doctor?.name || '';
    const docSpec = a.doctor?.specialization || '';
    const matchesSearch = 
      docName.toLowerCase().includes(search.toLowerCase()) ||
      docSpec.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-xs text-slate-500">Live consultation bookings synced directly with PostgreSQL</p>
        </div>
        <Link
          to="/doctors"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          + Book New Slot
        </Link>
      </div>

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

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">Loading appointments...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No appointments found matching current filters.
          </div>
        ) : (
          filtered.map((appt) => (
            <div key={appt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{appt.doctor?.name || 'Assigned Doctor'}</h3>
                  <StatusBadge status={appt.status} />
                </div>
                <p className="text-xs text-slate-500">{appt.doctor?.specialization || 'Clinical Doctor'}</p>
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
                    onClick={() => handleOpenPrescription(appt.id)}
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
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block">Diagnosis:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{selectedPrescription.diagnosis}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block mb-1">Medicines:</span>
              <div className="space-y-1.5">
                {selectedPrescription.items?.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="font-bold text-slate-800">{m.medicineName}</span>
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
