import api from './api';

export const doctorService = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getAvailableSlots: (doctorId, date) => api.get(`/doctors/${doctorId}/slots?date=${date}`),
};

export const departmentService = {
  getAllDepartments: () => api.get('/departments'),
};

export const appointmentService = {
  bookAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my'),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status?status=${status}`),
  getPrescription: (id) => api.get(`/appointments/${id}/prescription`),
};

export const prescriptionService = {
  createPrescription: (appointmentId, data) => api.post(`/prescriptions/appointment/${appointmentId}`, data),
  getPrescription: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),
};

export const patientService = {
  getAllPatients: () => api.get('/patients'),
  getPatientById: (id) => api.get(`/patients/${id}`),
  updateProfile: (id, data) => api.put(`/patients/${id}`, data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllDoctors: () => api.get('/admin/doctors'),
  updateDoctorStatus: (id, status) => api.patch(`/admin/doctors/${id}/status?status=${status}`),
  getAllAppointments: () => api.get('/admin/appointments'),
  createDepartment: (data) => api.post('/admin/departments', data),
};
