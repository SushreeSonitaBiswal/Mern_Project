import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  ArrowRight, 
  Stethoscope, 
  CheckCircle2 
} from 'lucide-react';
import { authService, departmentService } from '../../services';

const Register = () => {
  const [roleType, setRoleType] = useState('PATIENT'); // 'PATIENT' | 'DOCTOR'
  const [departments, setDepartments] = useState([]);
  
  // Patient Form State
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: ''
  });

  // Doctor Form State
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 3,
    consultationFee: 700,
    bio: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentService.getAllDepartments();
        if (res?.data) setDepartments(res.data);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchDepts();
  }, []);

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(patientData);
      navigate('/patient');
    } catch (err) {
      setError(err?.message || 'Patient registration failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.registerDoctor({
        ...doctorData,
        experienceYears: Number(doctorData.experienceYears),
        consultationFee: Number(doctorData.consultationFee),
        departmentId: doctorData.departmentId ? Number(doctorData.departmentId) : null
      });
      setSuccessMsg('Your doctor application has been submitted successfully! The hospital administrator will verify your credentials and approve your account.');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Doctor application failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <img
            src="/logo.svg"
            alt="CareConnect Logo"
            className="mx-auto w-14 h-14 drop-shadow-md hover:scale-105 transition-transform"
          />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            {roleType === 'PATIENT' ? 'Create Patient Account' : 'Doctor Practitioner Application'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {roleType === 'PATIENT' 
              ? 'Sign up to consult doctors, track bookings, and access medical records'
              : 'Join the clinical care network. Applications undergo license review by admin.'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setRoleType('PATIENT'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              roleType === 'PATIENT' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Patient Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setRoleType('DOCTOR'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              roleType === 'DOCTOR' 
                ? 'bg-white text-teal-700 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Apply as Doctor
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 p-4 border border-rose-100 flex items-center gap-3 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl bg-teal-50 p-5 border border-teal-100 text-center space-y-3">
            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Application Submitted!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{successMsg}</p>
            <Link
              to="/login"
              className="inline-block mt-2 px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700"
            >
              Go to Sign In
            </Link>
          </div>
        )}

        {/* Patient Registration Form */}
        {!successMsg && roleType === 'PATIENT' && (
          <form className="space-y-4 text-xs" onSubmit={handlePatientSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={patientData.name}
                  onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@careconnect.com"
                  value={patientData.email}
                  onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={patientData.password}
                  onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98111 22233"
                  value={patientData.phone}
                  onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Gender</label>
                <select
                  value={patientData.gender}
                  onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Blood Group</label>
                <select
                  value={patientData.bloodGroup}
                  onChange={(e) => setPatientData({ ...patientData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Bhubaneswar, Odisha, India"
                value={patientData.address}
                onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Patient Account...' : 'Complete Patient Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Doctor Application Form */}
        {!successMsg && roleType === 'DOCTOR' && (
          <form className="space-y-4 text-xs" onSubmit={handleDoctorSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. S. K. Mohapatra"
                  value={doctorData.name}
                  onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="doctor@careconnect.com"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={doctorData.password}
                  onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={doctorData.phone}
                  onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Clinical Department</label>
                <select
                  value={doctorData.departmentId}
                  onChange={(e) => setDoctorData({ ...doctorData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Medical Specialization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiologist, Neurologist"
                  value={doctorData.specialization}
                  onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Medical Degrees *</label>
                <input
                  type="text"
                  required
                  placeholder="MBBS, MD (General Medicine)"
                  value={doctorData.qualification}
                  onChange={(e) => setDoctorData({ ...doctorData, qualification: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  value={doctorData.experienceYears}
                  onChange={(e) => setDoctorData({ ...doctorData, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  min="100"
                  value={doctorData.consultationFee}
                  onChange={(e) => setDoctorData({ ...doctorData, consultationFee: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Professional Bio & Experience</label>
              <textarea
                rows="2"
                placeholder="Hospital affiliations, certifications, clinical research..."
                value={doctorData.bio}
                onChange={(e) => setDoctorData({ ...doctorData, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting Application...' : 'Submit Doctor Application (Pending Approval)'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
