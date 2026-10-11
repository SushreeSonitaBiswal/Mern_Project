import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  ChevronRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { doctorService, departmentService, appointmentService } from '../../services';
import StarRating from '../../components/common/StarRating';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [maxFee, setMaxFee] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState('09:00:00');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch real doctors and departments from Backend API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docRes, deptRes] = await Promise.all([
          doctorService.getAllDoctors(),
          departmentService.getAllDepartments()
        ]);
        if (docRes?.data) setDoctors(docRes.data);
        if (deptRes?.data) setDepartments(deptRes.data);
      } catch (err) {
        console.error('Failed to fetch doctors/departments from API:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch dynamic available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await doctorService.getAvailableSlots(selectedDoctor.id, selectedDate);
          if (res?.data) {
            setAvailableSlots(res.data);
            const firstAvail = res.data.find(s => s.available);
            if (firstAvail) setSelectedTime(firstAvail.time);
          }
        } catch (err) {
          console.error('Failed to fetch slots:', err);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingSuccess(false);
    setBookingError('');
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setBookingError('');
      await appointmentService.bookAppointment({
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        symptoms: symptoms || 'General Clinical Consultation'
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingModalOpen(false);
        setBookingSuccess(false);
        setSymptoms('');
        navigate('/patient/appointments');
      }, 1800);
    } catch (err) {
      setBookingError(err?.message || 'Failed to book slot. It might be already taken.');
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesQuery =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === 'ALL' || (doc.department && doc.department.name === selectedDept);
    const matchesFee = !maxFee || doc.consultationFee <= Number(maxFee);
    return matchesQuery && matchesDept && matchesFee;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/10">
          <div className="max-w-2xl space-y-3">

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Find & Book Verified Doctors
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Real-time schedule consultation slots, compare rates, and book appointments backed by Supabase PostgreSQL.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors by name or medical specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Any Consultation Fee</option>
                <option value="600">Up to ₹600</option>
                <option value="800">Up to ₹800</option>
                <option value="1000">Up to ₹1000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-sm font-medium">Loading verified doctors...</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-3">
            <Search className="w-8 h-8 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No doctors match your search</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-emerald-200"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl shrink-0">
                      {doctor.name.replace('Dr. ', '')[0]}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                        {doctor.department?.name || doctor.specialization}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 truncate">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {doctor.qualification}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <StarRating rating={doctor.averageRating || 5.0} totalReviews={doctor.totalReviews || 10} />
                    <span className="font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                      {doctor.experienceYears || 5} yrs exp
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {doctor.bio || 'Certified specialist providing patient-centered care and modern medical consultations.'}
                  </p>
                </div>

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

      {/* Booking Modal */}
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
              Your appointment with <strong>{selectedDoctor?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> is scheduled in Supabase.
            </p>
            <div className="text-xs text-emerald-600 font-medium">
              Redirecting to your Appointments Workspace...
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            {bookingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {bookingError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Select Date
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Available Time Slots (Calculated Dynamically from DB)
              </label>
              {loadingSlots ? (
                <div className="py-4 text-center text-xs text-slate-400">Loading open slots...</div>
              ) : availableSlots.length === 0 ? (
                <div className="py-4 text-center text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
                  No clinic slots open on this date. Please choose another weekday.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${!slot.available
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500'
                        }`}
                    >
                      {slot.formattedTime || slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Chief Symptoms or Visit Purpose
              </label>
              <textarea
                rows="2"
                placeholder="Describe your health symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={availableSlots.length === 0}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50"
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
