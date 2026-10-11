import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Plus, 
  Trash2, 
  Activity, 
  Stethoscope, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { INITIAL_APPOINTMENTS, INITIAL_PRESCRIPTIONS } from '../../services/mockData';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('REQUESTED');
  
  // Prescription creation modal
  const [prescriptionModalAppt, setPrescriptionModalAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
  ]);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  // Availability schedule settings state
  const [workingDays, setWorkingDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('careconnect_appointments') || 'null');
    if (saved) {
      setAppointments(saved);
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
    }
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setAppointments(updated);
    localStorage.setItem('careconnect_appointments', JSON.stringify(updated));
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
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
    setAdvice('Drink plenty of water and take proper rest.');
    setMedicines([
      { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', instructions: 'After meals' }
    ]);
    setPrescriptionSaved(false);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    if (!diagnosis) return;

    // Mark appointment as COMPLETED
    handleUpdateStatus(prescriptionModalAppt.id, 'COMPLETED');

    // Save prescription into mock storage
    INITIAL_PRESCRIPTIONS[prescriptionModalAppt.id] = {
      id: Date.now(),
      appointmentId: prescriptionModalAppt.id,
      doctorName: user?.name || 'Dr. Raj Kumar',
      doctorSpecialization: 'Consultant Specialist',
      patientName: prescriptionModalAppt.patientName,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      advice,
      medicines
    };

    setPrescriptionSaved(true);
    setTimeout(() => {
      setPrescriptionModalAppt(null);
      setPrescriptionSaved(false);
    }, 1500);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    setScheduleSavedMsg(true);
    setTimeout(() => setScheduleSavedMsg(false), 2500);
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
              Doctor Consultation Suite
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {user?.name || 'Dr. Raj Kumar'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Cardiology Specialist • 12 Years Exp • CareConnect Verified
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              On Duty & Accepting Patients
            </span>
          </div>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Requests</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confirmed Queue</span>
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Visits</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{completedAppts.length}</div>
            <span className="text-xs text-slate-400">Prescriptions signed</span>
          </div>
        </div>

        {/* Doctor Working Hours & Availability Configuration Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Schedule & Working Hours</h3>
              <p className="text-xs text-slate-500">Define active clinic days and consultation timings for patients to book</p>
            </div>
            {scheduleSavedMsg && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in">
                ✓ Timings updated successfully
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSchedule} className="space-y-4 pt-1">
            {/* Day Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const isSelected = workingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Clinic Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Clinic Close</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="sm:pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Schedule
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Appointment Management Table & Queue */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          
          {/* Header tabs */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900">Consultation Management</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['REQUESTED', 'CONFIRMED', 'COMPLETED', 'ALL'].map((tab) => (
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

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No patient visits found under this queue.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Patient Details</th>
                      <th className="px-6 py-3.5">Date & Slot</th>
                      <th className="px-6 py-3.5">Symptoms / Concerns</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Consultation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {appt.patientName}
                          <span className="block text-[11px] font-normal text-slate-400">
                            {appt.patientPhone || appt.patientEmail}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800">{appt.appointmentDate}</span>
                          <span className="block text-[11px] text-slate-400">{appt.appointmentTime}</span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                          {appt.symptoms || 'General clinical review'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {appt.status === 'REQUESTED' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                Accept Slot
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                                className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {appt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleOpenPrescriptionModal(appt)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              Write Prescription
                            </button>
                          )}
                          {appt.status === 'COMPLETED' && (
                            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-md">
                              ✓ Consultation Done
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{appt.patientName}</h4>
                        <span className="text-xs text-slate-400">{appt.patientPhone || appt.patientEmail}</span>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{appt.appointmentDate} at {appt.appointmentTime}</span>
                    </div>

                    <p className="text-xs text-slate-600 italic">
                      "{appt.symptoms || 'General Checkup'}"
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {appt.status === 'REQUESTED' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 font-semibold text-xs"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs"
                          >
                            Accept
                          </button>
                        </>
                      )}
                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleOpenPrescriptionModal(appt)}
                          className="w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Stethoscope className="w-4 h-4" />
                          Write Prescription & Finish Visit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Digital Prescription Composer Modal */}
      <Modal
        isOpen={!!prescriptionModalAppt}
        onClose={() => setPrescriptionModalAppt(null)}
        title={prescriptionModalAppt ? `Prescribe Medication — ${prescriptionModalAppt.patientName}` : 'Prescription Composer'}
        maxWidth="max-w-2xl"
      >
        {prescriptionSaved ? (
          <div className="text-center py-8 space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Prescription Saved & Visit Completed!</h3>
            <p className="text-xs text-slate-500">
              The digital prescription has been logged to the patient's medical records vault.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSavePrescription} className="space-y-4">
            
            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acute Bronchitis, Essential Hypertension..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Medicines Dynamic Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Prescribed Medicines
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {medicines.map((med, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Medicine name (e.g. Amoxicillin 500mg)"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                      />
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Dosage (500mg)"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (1-0-1)"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="Duration (5 days)"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Doctor Instructions / Lifestyle Advice
              </label>
              <textarea
                rows="2"
                placeholder="Take with warm water, avoid oily food, review in 7 days..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPrescriptionModalAppt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Sign & Finalize Consultation
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default DoctorDashboard;
