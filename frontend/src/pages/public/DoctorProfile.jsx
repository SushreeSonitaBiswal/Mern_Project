import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorService, appointmentService } from '../../services';
import StarRating from '../../components/common/StarRating';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Phone, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('09:00:00');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const res = await doctorService.getDoctorById(id);
        if (res?.data) setDoctor(res.data);
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  useEffect(() => {
    if (doctor && selectedDate) {
      const fetchSlots = async () => {
        try {
          const res = await doctorService.getAvailableSlots(doctor.id, selectedDate);
          if (res?.data) {
            setAvailableSlots(res.data);
            const first = res.data.find(s => s.available);
            if (first) setSelectedTime(first.time);
          }
        } catch (err) {
          console.error('Failed to fetch slots:', err);
        }
      };
      fetchSlots();
    }
  }, [doctor, selectedDate]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setErrorMsg('');
      await appointmentService.bookAppointment({
        doctorId: doctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        symptoms: symptoms || 'General Clinical Consultation'
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingModalOpen(false);
        setBookingSuccess(false);
        navigate('/patient/appointments');
      }, 1800);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to reserve appointment slot.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-sm">Loading doctor profile...</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20 text-slate-500">
        Doctor not found.{' '}
        <Link to="/doctors" className="text-emerald-600 underline">Browse doctors</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link 
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Doctors Directory
        </Link>

        {/* Doctor Header Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-3xl shadow-sm shrink-0">
              {doctor.name.replace('Dr. ', '')[0]}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {doctor.department?.name || doctor.specialization}
                </span>
                <span className="text-xs font-semibold text-slate-400">• {doctor.experienceYears || 5} Years Experience</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {doctor.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">{doctor.qualification}</p>
              <div className="flex items-center gap-3 pt-1">
                <StarRating rating={doctor.averageRating || 5.0} totalReviews={doctor.totalReviews || 10} size="md" />
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
              <span className="text-2xl font-extrabold text-slate-900">₹{doctor.consultationFee}</span>
            </div>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">Biography & Background</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {doctor.bio || 'Clinical healthcare provider focused on advanced diagnosis, preventive treatments, and patient recovery.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Consultation Information</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Department</span>
                    <span>{doctor.department?.name || 'General Healthcare'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Phone Desk</span>
                    <span>{doctor.phone || 'Hospital Reception Desk'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={`Book Visit with ${doctor.name}`}
      >
        {bookingSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Appointment Booked!</h3>
            <p className="text-xs text-slate-500">
              Your consultation on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been logged to the database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Select Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Available Slots</label>
              {availableSlots.length === 0 ? (
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-center">
                  No slots available on this date.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedTime(s.time)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        !s.available
                          ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                          : selectedTime === s.time
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {s.formattedTime || s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Symptoms / Reason</label>
              <textarea
                rows="2"
                placeholder="Describe your symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={availableSlots.length === 0}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DoctorProfile;
