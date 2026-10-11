import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  User, 
  AlertCircle, 
  Search, 
  XCircle, 
  ChevronRight,
  Download,
  Stethoscope,
  Pill,
  Star
} from 'lucide-react';
import { INITIAL_APPOINTMENTS, INITIAL_PRESCRIPTIONS } from '../../services/mockData';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import StarRating from '../../components/common/StarRating';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Modals
  const [viewPrescription, setViewPrescription] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [cancelModal, setCancelModal] = useState(null);

  useEffect(() => {
    // Load from localStorage or INITIAL_APPOINTMENTS
    const saved = JSON.parse(localStorage.getItem('careconnect_appointments') || 'null');
    if (saved) {
      setAppointments(saved);
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem('careconnect_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    }
  }, []);

  const handleCancelAppointment = (id) => {
    const updated = appointments.map((a) => 
      a.id === id ? { ...a, status: 'CANCELLED' } : a
    );
    setAppointments(updated);
    localStorage.setItem('careconnect_appointments', JSON.stringify(updated));
    setCancelModal(null);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    alert(`Thank you! Your ${reviewRating}-star review has been recorded.`);
    setReviewModal(null);
    setReviewComment('');
  };

  // Filtered by tab
  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'UPCOMING') return appt.status === 'CONFIRMED' || appt.status === 'REQUESTED';
    if (activeTab === 'COMPLETED') return appt.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return appt.status === 'CANCELLED' || appt.status === 'REJECTED';
    return true;
  });

  const upcomingCount = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'REQUESTED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED' || a.status === 'REJECTED').length;

  // Next imminent appointment
  const nextAppointment = appointments.find((a) => a.status === 'CONFIRMED');

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Patient Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Patient'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your healthcare visits, check diagnosis prescriptions, and track appointments.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Metric Summary Cards (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div 
            onClick={() => setActiveTab('UPCOMING')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'UPCOMING' ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Visits</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Visits</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cancelled / Declined</span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{cancelledCount}</div>
            <span className="text-xs text-slate-400">Past inactive slots</span>
          </div>
        </div>

        {/* Next Imminent Appointment Focus Banner */}
        {nextAppointment && (
          <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" />
                Next Upcoming Consultation
              </span>
              <h3 className="text-xl font-bold">{nextAppointment.doctorName}</h3>
              <p className="text-xs text-emerald-200">
                Specialization: {nextAppointment.doctorSpecialization} • Date: {nextAppointment.appointmentDate} at {nextAppointment.appointmentTime}
              </p>
              <p className="text-xs text-emerald-100 italic">
                "{nextAppointment.symptoms}"
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCancelModal(nextAppointment)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
              >
                Cancel Slot
              </button>
            </div>
          </div>
        )}

        {/* Appointment Records Table / Card List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          
          {/* Filter Tabs */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900">Appointment Records</h2>
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

          {/* Desktop Table View & Mobile Card View */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No appointments found in this category.</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Doctor & Specialty</th>
                      <th className="px-6 py-3.5">Date & Time</th>
                      <th className="px-6 py-3.5">Symptoms / Notes</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {appt.doctorName}
                          <span className="block text-[11px] font-normal text-slate-400">
                            {appt.doctorSpecialization}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800">{appt.appointmentDate}</span>
                          <span className="block text-[11px] text-slate-400">{appt.appointmentTime}</span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                          {appt.symptoms || 'General Checkup'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {appt.status === 'COMPLETED' && (
                            <>
                              <button
                                onClick={() => setViewPrescription(INITIAL_PRESCRIPTIONS[appt.id] || INITIAL_PRESCRIPTIONS[102])}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Prescription
                              </button>
                              <button
                                onClick={() => setReviewModal(appt)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5" />
                                Rate
                              </button>
                            </>
                          )}
                          {(appt.status === 'CONFIRMED' || appt.status === 'REQUESTED') && (
                            <button
                              onClick={() => setCancelModal(appt)}
                              className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-[11px] transition-colors cursor-pointer"
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

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{appt.doctorName}</h4>
                        <span className="text-xs text-slate-400">{appt.doctorSpecialization}</span>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{appt.appointmentDate} at {appt.appointmentTime}</span>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                      "{appt.symptoms || 'Routine clinical visit'}"
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {appt.status === 'COMPLETED' && (
                        <>
                          <button
                            onClick={() => setViewPrescription(INITIAL_PRESCRIPTIONS[appt.id] || INITIAL_PRESCRIPTIONS[102])}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Rx
                          </button>
                          <button
                            onClick={() => setReviewModal(appt)}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-semibold text-xs flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5" />
                            Review
                          </button>
                        </>
                      )}
                      {(appt.status === 'CONFIRMED' || appt.status === 'REQUESTED') && (
                        <button
                          onClick={() => setCancelModal(appt)}
                          className="px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 font-semibold text-xs"
                        >
                          Cancel Appointment
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

      {/* Prescription View Modal */}
      <Modal
        isOpen={!!viewPrescription}
        onClose={() => setViewPrescription(null)}
        title="Electronic Clinical Prescription (Rx)"
      >
        {viewPrescription && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Header info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{viewPrescription.doctorName}</h4>
                <p className="text-slate-500">{viewPrescription.doctorSpecialization}</p>
                <p className="text-[11px] text-slate-400 mt-1">CareConnect Certified Hospital</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800 block">Date: {viewPrescription.date}</span>
                <span className="text-[11px] text-emerald-600 font-bold">Ref #{viewPrescription.id}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Clinical Diagnosis:
              </span>
              <p className="font-semibold text-slate-900 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                {viewPrescription.diagnosis}
              </p>
            </div>

            {/* Medicines List */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Prescribed Medicines (Rx):
              </span>
              <div className="space-y-2">
                {viewPrescription.medicines.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-emerald-600" />
                        {m.name}
                      </div>
                      <span className="text-[11px] text-slate-500">{m.instructions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{m.dosage}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{m.frequency}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{m.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Doctor's Dietary & Lifestyle Advice:
              </span>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                {viewPrescription.advice}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-xs hover:bg-slate-800 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Download Prescription
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => setReviewModal(null)}
        title={reviewModal ? `Review Dr. ${reviewModal.doctorName}` : 'Doctor Review'}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="text-center py-2 space-y-2">
            <p className="text-xs text-slate-500">How was your medical consultation experience?</p>
            <div className="flex justify-center">
              <StarRating
                rating={reviewRating}
                interactive={true}
                size="lg"
                onRatingChange={(r) => setReviewRating(r)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Feedback & Comments
            </label>
            <textarea
              rows="4"
              required
              placeholder="Share how the doctor helped you with your health condition..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReviewModal(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        title="Cancel Appointment Confirmation"
      >
        {cancelModal && (
          <div className="space-y-4 text-xs text-slate-600">
            <p>
              Are you sure you want to cancel your scheduled appointment with{' '}
              <strong>{cancelModal.doctorName}</strong> on <strong>{cancelModal.appointmentDate}</strong> at{' '}
              <strong>{cancelModal.appointmentTime}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={() => handleCancelAppointment(cancelModal.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default PatientDashboard;
