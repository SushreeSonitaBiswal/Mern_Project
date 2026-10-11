import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Stethoscope, 
  Save, 
  Plus, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { appointmentService, prescriptionService } from '../../services';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Prescription creation modal
  const [prescriptionModalAppt, setPrescriptionModalAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
  ]);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  // Availability schedule settings state
  const [workingDays, setWorkingDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments();
      if (res?.data) setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentService.updateStatus(id, newStatus);
      fetchAppointments();
    } catch (err) {
      alert(err?.message || 'Failed to update appointment status');
    }
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicineName: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleOpenPrescriptionModal = (appt) => {
    setPrescriptionModalAppt(appt);
    setDiagnosis('');
    setAdvice('Drink plenty of fluids and maintain bed rest.');
    setMedicines([
      { medicineName: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', instructions: 'After meals' }
    ]);
    setPrescriptionSaved(false);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!diagnosis) return;

    try {
      await prescriptionService.createPrescription(prescriptionModalAppt.id, {
        diagnosis,
        advice,
        items: medicines
      });

      setPrescriptionSaved(true);
      fetchAppointments();
      setTimeout(() => {
        setPrescriptionModalAppt(null);
        setPrescriptionSaved(false);
      }, 1500);
    } catch (err) {
      alert(err?.message || 'Failed to generate prescription');
    }
  };

  const toggleDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const requestedAppts = appointments.filter((a) => a.status === 'REQUESTED');
  const confirmedAppts = appointments.filter((a) => a.status === 'CONFIRMED');
  const completedAppts = appointments.filter((a) => a.status === 'COMPLETED');

  const filteredAppointments = appointments.filter((a) => {
    if (activeTab === 'REQUESTED') return a.status === 'REQUESTED';
    if (activeTab === 'CONFIRMED') return a.status === 'CONFIRMED';
    if (activeTab === 'COMPLETED') return a.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Doctor Consultation Suite (Live API)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {user?.name || 'Dr. Raj Kumar'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Assigned Clinic • Active On-Duty Queue
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Syncing Live with Database
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveTab('REQUESTED')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'REQUESTED' ? 'bg-amber-50/70 border-amber-300 shadow-xs' : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Pending Requests</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{requestedAppts.length}</div>
            <span className="text-xs text-slate-400">Requires acceptance</span>
          </div>

          <div 
            onClick={() => setActiveTab('CONFIRMED')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'CONFIRMED' ? 'bg-teal-50/70 border-teal-300 shadow-xs' : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Confirmed Queue</span>
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{confirmedAppts.length}</div>
            <span className="text-xs text-slate-400">Ready for consultation</span>
          </div>

          <div 
            onClick={() => setActiveTab('COMPLETED')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'COMPLETED' ? 'bg-blue-50/70 border-blue-300 shadow-xs' : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Completed Visits</span>
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{completedAppts.length}</div>
            <span className="text-xs text-slate-400">Prescriptions logged</span>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Consultation Queue</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'REQUESTED', 'CONFIRMED', 'COMPLETED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === tab ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <span className="text-xs">Fetching consultation requests...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No visits found under this queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Patient Details</th>
                    <th className="px-6 py-3.5">Slot Date & Time</th>
                    <th className="px-6 py-3.5">Symptoms</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Consultation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {appt.patient?.name || 'Patient'}
                        <span className="block text-[11px] font-normal text-slate-400">{appt.patient?.phone}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{appt.appointmentDate}</span>
                        <span className="block text-[11px] text-slate-400 font-normal">{appt.appointmentTime}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                        {appt.symptoms || 'General Checkup'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={appt.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {appt.status === 'REQUESTED' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-[11px] cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 font-semibold text-[11px] cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {appt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleOpenPrescriptionModal(appt)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            Write Rx
                          </button>
                        )}
                        {appt.status === 'COMPLETED' && (
                          <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-md">
                            ✓ Prescribed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Digital Prescription Composer Modal */}
      <Modal
        isOpen={!!prescriptionModalAppt}
        onClose={() => setPrescriptionModalAppt(null)}
        title={prescriptionModalAppt ? `Prescribe Medication — ${prescriptionModalAppt.patient?.name || 'Patient'}` : 'Prescription Composer'}
        maxWidth="max-w-2xl"
      >
        {prescriptionSaved ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Prescription Saved to PostgreSQL!</h3>
            <p className="text-xs text-slate-500">Visit marked as completed.</p>
          </div>
        ) : (
          <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Diagnosis *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acute Pharyngitis, Mild Bronchitis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase text-slate-400">Medicines</label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="text-xs text-emerald-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {medicines.map((med, index) => (
                  <div key={index} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Medicine name (e.g. Amoxicillin 500mg)"
                        value={med.medicineName}
                        onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                      />
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Clinical Advice</label>
              <textarea
                rows="2"
                placeholder="Doctor's dietary and lifestyle instructions..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrescriptionModalAppt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
              >
                Sign & Finalize Rx
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
