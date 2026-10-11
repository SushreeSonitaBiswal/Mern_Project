import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Mail, Phone, DollarSign, Award, Clock, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { doctorService } from '../../services';

const DoctorProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialization: '',
    department: '',
    qualification: '',
    experienceYears: 0,
    consultationFee: 500,
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const fetchDocProfile = async () => {
      setLoading(true);
      try {
        const res = await doctorService.getAllDoctors();
        const list = res?.data || [];
        const currentDoc = list.find(d => d.user?.email === user?.email || d.email === user?.email);
        if (currentDoc) {
          setDoctorId(currentDoc.id);
          setProfile({
            name: currentDoc.name || user?.name || '',
            email: currentDoc.user?.email || currentDoc.email || user?.email || '',
            phone: currentDoc.phone || '',
            specialization: currentDoc.specialization || '',
            department: currentDoc.department?.name || '',
            qualification: currentDoc.qualification || '',
            experienceYears: currentDoc.experienceYears || 0,
            consultationFee: currentDoc.consultationFee || 500,
            bio: currentDoc.bio || ''
          });
        }
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchDocProfile();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Profile & Clinical Settings</h1>
          <p className="text-xs text-slate-500">Update medical qualifications, consultation rates, and professional bio</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Profile updated
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            <span className="text-xs">Loading doctor settings...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Doctor Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Specialization</label>
              <input
                type="text"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                value={profile.consultationFee}
                onChange={(e) => setProfile({ ...profile, consultationFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Qualifications</label>
              <input
                type="text"
                value={profile.qualification}
                onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={profile.experienceYears}
                onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Professional Bio</label>
            <textarea
              rows="3"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default DoctorProfileSettings;
