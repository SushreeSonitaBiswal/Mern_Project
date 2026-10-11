import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { INITIAL_DOCTORS } from '../../services/mockData';
import StarRating from '../../components/common/StarRating';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { 
  Stethoscope, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Star, 
  ChevronLeft,
  DollarSign
} from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const doctor = INITIAL_DOCTORS.find((d) => d.id === Number(id)) || INITIAL_DOCTORS[0];

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '04:00 PM', available: true },
    { time: '04:30 PM', available: true },
  ];

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const saved = JSON.parse(localStorage.getItem('careconnect_appointments') || '[]');
    const newAppointment = {
      id: Date.now(),
      patientId: user.profileId || 1,
      patientName: user.name || 'Rahul Sharma',
      patientEmail: user.email,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      status: 'CONFIRMED',
      symptoms: symptoms || 'General Medical Consultation',
      createdAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('careconnect_appointments', JSON.stringify([newAppointment, ...saved]));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingSuccess(false);
      navigate('/patient/appointments');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back navigation */}
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
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-50 shadow-md shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {doctor.department}
                </span>
                <span className="text-xs font-semibold text-slate-400">• {doctor.experienceYears} Years Experience</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {doctor.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">{doctor.qualification}</p>
              <div className="flex items-center gap-3 pt-1">
                <StarRating rating={doctor.averageRating} totalReviews={doctor.totalReviews} size="md" />
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

        {/* Doctor Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: About & Qualifications */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">Biography & Background</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Patient Testimonials & Reviews</h2>
              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                <div className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Amit Sen</span>
                    <StarRating rating={5} />
                  </div>
                  <p className="text-slate-500">
                    "Dr. {doctor.name} was extremely thorough, explained my diagnosis with patience, and prescribed medication that helped within two days."
                  </p>
                </div>
                <div className="pt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Neha Verma</span>
                    <StarRating rating={4.8} />
                  </div>
                  <p className="text-slate-500">
                    "Very professional approach and great bedside manners. Clinic waiting time was minimal."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Schedule & Clinic Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Consultation Timings</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Available Days</span>
                    <span>{doctor.availableDays?.join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Clinic Hours</span>
                    <span>{doctor.timings}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Contact Desk</span>
                    <span>{doctor.phone}</span>
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
              Your consultation on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been logged.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
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
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((s) => (
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
                    {s.time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Symptoms / Reason</label>
              <textarea
                rows="2"
                placeholder="Describe your health issue..."
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
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
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
