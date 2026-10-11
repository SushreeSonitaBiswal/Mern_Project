import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  Clock,
  Loader2
} from 'lucide-react';
import { adminService } from '../../services';

const SystemReports = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const [apptsRes, statsRes] = await Promise.all([
          adminService.getAllAppointments(),
          adminService.getStats()
        ]);
        if (apptsRes?.data) setAppointments(apptsRes.data);
        if (statsRes?.data) setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load system reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const completedAppts = appointments.filter((a) => a.status === 'COMPLETED');
  const totalRevenue = appointments.reduce((sum, a) => {
    if (a.status === 'COMPLETED') {
      return sum + (a.doctor?.consultationFee || 800);
    }
    return sum;
  }, 0);

  const completionRate = appointments.length > 0
    ? Math.round((completedAppts.length / appointments.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital Analytics & Financial Reports</h1>
        <p className="text-xs text-slate-500">Key performance indicators, consultation efficiency, and patient inflow metrics</p>
      </div>

      {/* Analytics High Level Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span className="text-xs">Computing hospital analytics...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase">Total Revenue Generated</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Calculated from {completedAppts.length} completed visits
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase">Consultation Completion Rate</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{completionRate}%</div>
              <p className="text-[11px] text-blue-600 font-semibold">{appointments.length} Total Bookings</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase">Active Clinical Doctors</span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats?.totalDoctors ?? 0} Doctors</div>
              <p className="text-[11px] text-teal-600 font-semibold">{stats?.totalDepartments ?? 0} Medical Wings</p>
            </div>
          </div>
        </>
      )}

      {/* Breakdown by Specialty Chart simulation */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Department Booking Volumes</h3>
        
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Cardiology</span>
              <span>42% of bookings</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '42%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Pediatrics</span>
              <span>28% of bookings</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Orthopedics</span>
              <span>18% of bookings</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '18%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Neurology & Dermatology</span>
              <span>12% of bookings</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
