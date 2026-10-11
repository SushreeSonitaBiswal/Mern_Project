import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';

const DoctorAvailabilityPage = () => {
  const [schedule, setSchedule] = useState([
    { day: 'Monday', active: true, start: '09:00', end: '13:00', slotDuration: 30 },
    { day: 'Tuesday', active: true, start: '09:00', end: '13:00', slotDuration: 30 },
    { day: 'Wednesday', active: true, start: '09:00', end: '13:00', slotDuration: 30 },
    { day: 'Thursday', active: true, start: '14:00', end: '18:00', slotDuration: 30 },
    { day: 'Friday', active: true, start: '09:00', end: '13:00', slotDuration: 30 },
    { day: 'Saturday', active: false, start: '10:00', end: '14:00', slotDuration: 30 },
    { day: 'Sunday', active: false, start: '10:00', end: '14:00', slotDuration: 30 }
  ]);
  const [saved, setSaved] = useState(false);

  const handleToggle = (index) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Availability & Consultation Slots</h1>
          <p className="text-xs text-slate-500">Configure weekly recurring clinical timings for patient appointment booking</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Schedule saved
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="divide-y divide-slate-100">
            {schedule.map((item, index) => (
              <div key={item.day} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-40">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={() => handleToggle(index)}
                    className="w-4 h-4 rounded-md text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className={`text-xs font-bold ${item.active ? 'text-slate-900' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>

                {item.active ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">From:</span>
                      <input
                        type="time"
                        value={item.start}
                        onChange={(e) => handleChange(index, 'start', e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">To:</span>
                      <input
                        type="time"
                        value={item.end}
                        onChange={(e) => handleChange(index, 'end', e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Slot:</span>
                      <select
                        value={item.slotDuration}
                        onChange={(e) => handleChange(index, 'slotDuration', Number(e.target.value))}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Clinic Closed / Day Off</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Availability Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorAvailabilityPage;
