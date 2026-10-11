import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Heart, 
  Brain, 
  Baby, 
  Activity, 
  Sparkles, 
  Stethoscope 
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '../../services/mockData';
import Modal from '../../components/common/Modal';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('careconnect_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) return;

    const newDept = {
      id: Date.now(),
      name,
      icon: 'Building2',
      description: description || 'Specialized department unit'
    };
    const updated = [...departments, newDept];
    setDepartments(updated);
    localStorage.setItem('careconnect_departments', JSON.stringify(updated));
    setModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Departments</h1>
          <p className="text-xs text-slate-500">Configure medical specialties, department descriptions, and clinical units</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{dept.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed min-h-[3rem]">{dept.description}</p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Department ID: #{dept.id}</span>
              <span className="text-purple-600 font-semibold">Active Wing</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Hospital Medical Department"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ophthalmology, Oncology, ENT..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Overview of treatments, surgical procedures and equipment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDepartments;
