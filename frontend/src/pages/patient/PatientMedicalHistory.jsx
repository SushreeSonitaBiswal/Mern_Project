import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Stethoscope, Search, Pill, Loader2 } from 'lucide-react';
import { appointmentService } from '../../services';
import Modal from '../../components/common/Modal';

const PatientMedicalHistory = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await appointmentService.getMyAppointments();
        const appts = res?.data || [];
        // Filter completed appointments and fetch their prescriptions
        const completed = appts.filter(a => a.status === 'COMPLETED');
        
        const recordsWithPrescriptions = await Promise.all(
          completed.map(async (a) => {
            let rx = null;
            try {
              const rxRes = await appointmentService.getPrescription(a.id);
              rx = rxRes?.data;
            } catch (err) {
              // Rx not uploaded yet
            }
            return {
              id: a.id,
              date: a.appointmentDate,
              time: a.appointmentTime,
              doctorName: a.doctor?.name || 'Dr. Practitioner',
              doctorSpecialization: a.doctor?.specialization || 'General Physician',
              diagnosis: rx?.diagnosis || a.symptoms || 'General Checkup',
              advice: rx?.advice || 'Rest and stay hydrated',
              medicines: rx?.items || []
            };
          })
        );
        setMedicalRecords(recordsWithPrescriptions);
      } catch (err) {
        console.error('Failed to load medical history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = medicalRecords.filter(
    (p) =>
      p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medical History & Prescriptions Vault</h1>
        <p className="text-xs text-slate-500">Access and download verified diagnosis notes and electronic prescriptions</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by diagnosis or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">Loading clinical records...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 text-xs">
          No medical history or completed consultations found yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.date}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-2">{item.diagnosis}</h3>
                  <p className="text-xs text-slate-500">{item.doctorName} • {item.doctorSpecialization}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-[11px] text-slate-400 uppercase block">Prescribed Medication</span>
                <p className="font-semibold text-slate-800">
                  {item.medicines.length > 0 
                    ? item.medicines.map((m) => m.medicineName || m.name).join(', ') 
                    : 'Consultation notes recorded'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedPrescription(item)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  View Full Rx Details ➔
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Print"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Modal */}
      <Modal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        title="Electronic Clinical Prescription (Rx)"
      >
        {selectedPrescription && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">{selectedPrescription.doctorName}</h4>
              <p className="text-slate-500">{selectedPrescription.doctorSpecialization}</p>
              <p className="text-[11px] text-slate-400">Date: {selectedPrescription.date}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block">Diagnosis:</span>
              <p className="font-semibold text-slate-900 text-sm">{selectedPrescription.diagnosis}</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-slate-500 uppercase text-[11px] block">Medicines (Rx):</span>
              {selectedPrescription.medicines.length > 0 ? (
                selectedPrescription.medicines.map((m, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{m.medicineName || m.name}</span>
                      <span className="text-[11px] text-slate-400">{m.instructions || m.duration || ''}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded text-[11px]">
                      {m.dosage} • {m.frequency}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No specific medicines dispensed.</p>
              )}
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[11px] block">Advice:</span>
              <p className="text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedPrescription.advice}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientMedicalHistory;
