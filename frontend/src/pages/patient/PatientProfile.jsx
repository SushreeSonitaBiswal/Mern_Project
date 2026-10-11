import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Heart, Shield, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { patientService } from '../../services';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await patientService.getAllPatients();
        const list = res?.data || [];
        const myProfile = list.find(p => p.user?.email === user?.email || p.email === user?.email);
        if (myProfile) {
          setPatientId(myProfile.id);
          setProfile({
            name: myProfile.name || user?.name || '',
            email: myProfile.user?.email || user?.email || '',
            phone: myProfile.phone || '',
            gender: myProfile.gender || 'Male',
            dob: myProfile.dob || '',
            bloodGroup: myProfile.bloodGroup || 'O+',
            address: myProfile.address || '',
            emergencyContact: myProfile.emergencyContact || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (patientId) {
        await patientService.updateProfile(patientId, profile);
      }
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      alert(err?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personal & Medical Profile</h1>
          <p className="text-xs text-slate-500">Keep your clinical demographics and contact information up-to-date</p>
        </div>
        {savedMsg && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Profile updated successfully
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">Loading patient profile...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xl shadow-xs">
                {profile.name ? profile.name[0]?.toUpperCase() : 'P'}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{profile.name || 'Patient'}</h3>
                <p className="text-xs text-slate-400">CareConnect Patient ID: #{patientId ? `CC-PT-10${patientId}` : 'CC-PT-NEW'}</p>
              </div>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Blood Group</label>
              <select
                value={profile.bloodGroup}
                onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
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

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={profile.emergencyContact}
                onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Residential Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
