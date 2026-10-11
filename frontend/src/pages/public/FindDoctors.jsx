import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Award, 
  Star, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_DOCTORS, INITIAL_DEPARTMENTS } from '../../services/mockData';
import StarRating from '../../components/common/StarRating';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [maxFee, setMaxFee] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Available time slots generator for selected doctor
  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: true },
    { time: '04:00 PM', available: true },
    { time: '04:30 PM', available: true },
    { time: '05:00 PM', available: true },
  ];

  // Filtering doctors
  const filteredDoctors = INITIAL_DOCTORS.filter((doc) => {
    if (doc.status !== 'APPROVED') return false;
    const matchesQuery = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;
    const matchesFee = !maxFee || doc.consultationFee <= Number(maxFee);
    return matchesQuery && matchesDept && matchesFee;
  });

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Save appointment to localStorage mock state
    const savedAppts = JSON.parse(localStorage.getItem('careconnect_appointments') || '[]');
    const newAppointment = {
      id: Date.now(),
      patientId: user.profileId || 1,
      patientName: user.name || 'Current User',
      patientEmail: user.email,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      status: 'CONFIRMED',
      symptoms: symptoms || 'General Medical Consultation',
      createdAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('careconnect_appointments', JSON.stringify([newAppointment, ...savedAppts]));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingSuccess(false);
      setSymptoms('');
      navigate('/patient');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Clinical Specialists
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Find & Book Top Doctors
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Browse certified doctors, check real-time availability slots, compare consultation fees, and schedule visits seamlessly.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor name or condition (e.g. Cardiologist)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="ALL">All Departments</option>
                {INITIAL_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee Filter */}
            <div className="md:col-span-3">
              <select
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="">Any Consultation Fee</option>
                <option value="600">Up to ₹600</option>
                <option value="800">Up to ₹800</option>
                <option value="1000">Up to ₹1000</option>
              </select>
            </div>
          </div>

          {/* Quick Department Tags (Scrollable on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap">
              Quick Filter:
            </span>
            <button
              onClick={() => setSelectedDept('ALL')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedDept === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Specialties
            </button>
            {INITIAL_DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.name)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedDept === dept.name
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor List Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Showing <strong className="text-slate-800">{filteredDoctors.length}</strong> verified doctors</span>
            {(searchQuery || selectedDept !== 'ALL' || maxFee) && (
              <button 
                onClick={() => { setSearchQuery(''); setSelectedDept('ALL'); setMaxFee(''); }}
                className="text-emerald-600 hover:underline font-medium text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No doctors found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or clearing selected department filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-emerald-200"
                >
                  <div className="p-6 space-y-4">
                    {/* Header info with Avatar */}
                    <div className="flex items-start gap-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                          {doctor.department}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {doctor.qualification}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating and Experience */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <StarRating rating={doctor.averageRating} totalReviews={doctor.totalReviews} />
                      <span className="font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                        {doctor.experienceYears} yrs exp
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doctor.bio}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{doctor.timings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Fee & Book Button */}
                  <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{doctor.consultationFee}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(doctor)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Book Slot</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={selectedDoctor ? `Book Appointment — ${selectedDoctor.name}` : 'Book Appointment'}
      >
        {bookingSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Your appointment with <strong>{selectedDoctor?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been scheduled.
            </p>
            <div className="text-xs text-emerald-600 font-medium">
              Redirecting to your Patient Dashboard...
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            {selectedDoctor && (
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{selectedDoctor.specialization}</span>
                  <span className="text-slate-500">{selectedDoctor.qualification}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">Fee</span>
                  <span className="font-extrabold text-slate-800 text-sm">₹{selectedDoctor.consultationFee}</span>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                min="2026-10-11"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                required
              />
            </div>

            {/* Time Slots Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Available Time Slots (30 Min)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      !slot.available
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                        : selectedTime === slot.time
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms / Reason */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Chief Symptoms or Reason for Visit
              </label>
              <textarea
                rows="3"
                placeholder="Describe what you are experiencing (e.g. fever, headache, back pain)..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default FindDoctors;
