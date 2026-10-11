import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  XCircle, 
  Stethoscope, 
  Pill, 
  Download, 
  Loader2 
} from 'lucide-react';
import { appointmentService } from '../../services';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [viewPrescription, setViewPrescription] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);
  const [cancelModal, setCancelModal] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments();
      if (res?.data) setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    try {
      await appointmentService.updateStatus(id, 'CANCELLED');
      setCancelModal(null);
      fetchAppointments();
    } catch (err) {
      alert(err?.message || 'Failed to cancel appointment');
    }
  };

  const handleOpenPrescription = async (appointmentId) => {
    setLoadingPrescription(true);
    try {
      const res = await appointmentService.getPrescription(appointmentId);
      if (res?.data) setViewPrescription(res.data);
    } catch (err) {
      alert('Prescription not yet created for this consultation.');
    } finally {
      setLoadingPrescription(false);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'UPCOMING') return appt.status === 'CONFIRMED' || appt.status === 'REQUESTED';
    if (activeTab === 'COMPLETED') return appt.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return appt.status === 'CANCELLED' || appt.status === 'REJECTED';
    return true;
  });

  const upcomingCount = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'REQUESTED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED' || a.status === 'REJECTED').length;
  const nextAppointment = appointments.find((a) => a.status === 'CONFIRMED');

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Patient Portal (Live Supabase DB)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Patient'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage appointments, view electronic diagnosis prescriptions, and track visit history.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book New Slot</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveTab('UPCOMING')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'UPCOMING' ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Upcoming Visits</span>
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{upcomingCount}</div>
            <span className="text-xs text-slate-400">Scheduled consultations</span>
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
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{completedCount}</div>
            <span className="text-xs text-slate-400">Prescriptions available</span>
          </div>

          <div 
            onClick={() => setActiveTab('CANCELLED')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'CANCELLED' ? 'bg-slate-100 border-slate-300 shadow-xs' : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">Cancelled / Declined</span>
              <XCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{cancelledCount}</div>
            <span className="text-xs text-slate-400">Past slots</span>
          </div>
        </div>

        {/* Imminent Banner */}
        {nextAppointment && (
          <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" />
                Upcoming Consultation
              </span>
              <h3 className="text-xl font-bold">{nextAppointment.doctor?.name || 'Assigned Specialist'}</h3>
              <p className="text-xs text-emerald-200">
                Date: {nextAppointment.appointmentDate} at {nextAppointment.appointmentTime}
              </p>
              <p className="text-xs text-emerald-100 italic">"{nextAppointment.symptoms}"</p>
            </div>
            <button
              onClick={() => setCancelModal(nextAppointment)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer self-start md:self-auto"
            >
              Cancel Slot
            </button>
          </div>
        )}

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Appointment Records</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((tab) => (
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
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-sm">Fetching appointments from database...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No appointments found in this category.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Doctor & Specialty</th>
                    <th className="px-6 py-3.5">Date & Slot</th>
                    <th className="px-6 py-3.5">Symptoms</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {appt.doctor?.name || 'Dr. Specialist'}
                        <span className="block text-[11px] font-normal text-slate-400">
                          {appt.doctor?.specialization || 'Clinical Doctor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {appt.appointmentDate}
                        <span className="block text-[11px] text-slate-400 font-normal">{appt.appointmentTime}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                        {appt.symptoms || 'General Checkup'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={appt.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {appt.status === 'COMPLETED' && (
                          <button
                            onClick={() => handleOpenPrescription(appt.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] cursor-pointer"
                          >
                            View Rx
                          </button>
                        )}
                        {(appt.status === 'CONFIRMED' || appt.status === 'REQUESTED') && (
                          <button
                            onClick={() => setCancelModal(appt)}
                            className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-[11px] cursor-pointer"
                          >
                            Cancel
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

      </div>

      {/* Prescription View Modal */}
      <Modal
        isOpen={!!viewPrescription}
        onClose={() => setViewPrescription(null)}
        title="Electronic Clinical Prescription (Rx)"
      >
        {viewPrescription && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 text-sm block">CareConnect Clinical Prescription</span>
              <p className="text-[11px] text-slate-400">Appointment ID: #{viewPrescription.appointment?.id || viewPrescription.id}</p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[11px] block">Diagnosis:</span>
              <p className="font-semibold text-slate-900 mt-0.5 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                {viewPrescription.diagnosis}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[11px] block mb-1">Prescribed Medicines:</span>
              <div className="space-y-1.5">
                {viewPrescription.items?.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.medicineName}</span>
                      <span className="text-[11px] text-slate-400">{item.instructions}</span>
                    </div>
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {item.dosage} • {item.frequency} • {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[11px] block">Doctor's Advice:</span>
              <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">{viewPrescription.advice}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print Rx
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        title="Cancel Appointment"
      >
        {cancelModal && (
          <div className="space-y-4 text-xs text-slate-600">
            <p>Are you sure you want to cancel this scheduled appointment slot?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={() => handleCancelAppointment(cancelModal.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;
