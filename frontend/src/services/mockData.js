// Mock initial data store with localStorage fallback for frontend-first demo & offline resilience

export const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Cardiology', icon: 'Heart', description: 'Comprehensive heart & cardiovascular care' },
  { id: 2, name: 'Neurology', icon: 'Brain', description: 'Brain, spinal cord & nervous system treatments' },
  { id: 3, name: 'Pediatrics', icon: 'Baby', description: 'Dedicated healthcare for infants, children & teens' },
  { id: 4, name: 'Orthopedics', icon: 'Activity', description: 'Bone, joint, tendon & muscular disorders' },
  { id: 5, name: 'Dermatology', icon: 'Sparkles', description: 'Skin, hair, allergy & aesthetic treatments' },
  { id: 6, name: 'General Medicine', icon: 'Stethoscope', description: 'Primary consultations, fever & chronic checkups' }
];

export const INITIAL_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Raj Kumar',
    email: 'raj.kumar@careconnect.com',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    departmentId: 1,
    qualification: 'MBBS, MD (Cardiology)',
    experienceYears: 12,
    consultationFee: 800,
    averageRating: 4.9,
    totalReviews: 128,
    status: 'APPROVED',
    phone: '+91 98765 43210',
    bio: 'Senior Consultant Cardiologist with 12+ years of experience in clinical cardiology, ECG interpretation, preventative health and coronary artery disease management.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timings: '09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@careconnect.com',
    specialization: 'Neurologist',
    department: 'Neurology',
    departmentId: 2,
    qualification: 'MBBS, DM (Neurology)',
    experienceYears: 9,
    consultationFee: 1000,
    averageRating: 4.8,
    totalReviews: 94,
    status: 'APPROVED',
    phone: '+91 98765 43211',
    bio: 'Specialist in migraine management, stroke rehabilitation, nerve conduction studies, and neuro-critical care.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timings: '10:00 AM - 02:00 PM',
    image: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@careconnect.com',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    departmentId: 3,
    qualification: 'MBBS, DCH',
    experienceYears: 7,
    consultationFee: 600,
    averageRating: 5.0,
    totalReviews: 156,
    status: 'APPROVED',
    phone: '+91 98765 43212',
    bio: 'Dedicated child care physician specializing in newborn development, routine immunization, and childhood allergy management.',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timings: '11:00 AM - 04:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    name: 'Dr. Vikram Patel',
    email: 'vikram.patel@careconnect.com',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    departmentId: 4,
    qualification: 'MBBS, MS (Ortho)',
    experienceYears: 15,
    consultationFee: 900,
    averageRating: 4.7,
    totalReviews: 110,
    status: 'APPROVED',
    phone: '+91 98765 43213',
    bio: 'Expert in sports injury rehabilitation, joint replacements, arthroscopy, and spine care treatment.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    timings: '02:00 PM - 06:00 PM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 5,
    name: 'Dr. Sneha Roy',
    email: 'sneha.roy@careconnect.com',
    specialization: 'Dermatologist',
    department: 'Dermatology',
    departmentId: 5,
    qualification: 'MBBS, MD (Dermatology)',
    experienceYears: 6,
    consultationFee: 700,
    averageRating: 4.8,
    totalReviews: 82,
    status: 'PENDING',
    phone: '+91 98765 43214',
    bio: 'Consultant cosmetologist & dermatologist focused on clinical acne therapy, hair loss mitigation and laser treatment.',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    timings: '10:00 AM - 01:00 PM',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 101,
    patientId: 1,
    patientName: 'Rahul Sharma',
    patientEmail: 'rahul.sharma@careconnect.com',
    patientPhone: '+91 98111 22233',
    doctorId: 1,
    doctorName: 'Dr. Raj Kumar',
    doctorSpecialization: 'Cardiologist',
    appointmentDate: '2026-10-15',
    appointmentTime: '10:30 AM',
    status: 'CONFIRMED',
    symptoms: 'Mild chest heaviness after brisk morning walking. Normal BP at home.',
    doctorNotes: 'Advised fasting lipid profile and ECG.',
    createdAt: '2026-10-10'
  },
  {
    id: 102,
    patientId: 1,
    patientName: 'Rahul Sharma',
    patientEmail: 'rahul.sharma@careconnect.com',
    patientPhone: '+91 98111 22233',
    doctorId: 3,
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialization: 'Pediatrician',
    appointmentDate: '2026-10-08',
    appointmentTime: '11:00 AM',
    status: 'COMPLETED',
    symptoms: 'Son running mild fever and dry cough since 2 days.',
    doctorNotes: 'Viral pharyngitis. Recovery expected in 3-4 days.',
    createdAt: '2026-10-06'
  },
  {
    id: 103,
    patientId: 2,
    patientName: 'Pooja Das',
    patientEmail: 'pooja.das@gmail.com',
    patientPhone: '+91 98333 44455',
    doctorId: 1,
    doctorName: 'Dr. Raj Kumar',
    doctorSpecialization: 'Cardiologist',
    appointmentDate: '2026-10-16',
    appointmentTime: '11:30 AM',
    status: 'REQUESTED',
    symptoms: 'Routine follow-up on hypertension medication review.',
    createdAt: '2026-10-11'
  },
  {
    id: 104,
    patientId: 3,
    patientName: 'Amit Verma',
    patientEmail: 'amit.verma@gmail.com',
    patientPhone: '+91 98444 55566',
    doctorId: 4,
    doctorName: 'Dr. Vikram Patel',
    doctorSpecialization: 'Orthopedic Surgeon',
    appointmentDate: '2026-10-14',
    appointmentTime: '03:00 PM',
    status: 'REQUESTED',
    symptoms: 'Right knee stiffness after gym workout.',
    createdAt: '2026-10-11'
  }
];

export const INITIAL_PRESCRIPTIONS = {
  102: {
    id: 501,
    appointmentId: 102,
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialization: 'Pediatrician',
    patientName: 'Rahul Sharma (Son: Aarav)',
    date: '2026-10-08',
    diagnosis: 'Acute Viral Pharyngitis & Mild Upper Respiratory Infection',
    advice: 'Stay hydrated with warm fluids. Adequate bed rest. Steam inhalation twice daily.',
    medicines: [
      { name: 'Paracetamol Suspension 250mg/5ml', dosage: '5ml', frequency: 'Thrice daily', duration: '3 days', instructions: 'After meals when temp > 99.5F' },
      { name: 'Cetirizine Syrup 5mg/5ml', dosage: '2.5ml', frequency: 'Once daily (Night)', duration: '5 days', instructions: 'Before sleep' },
      { name: 'Saline Nasal Drops', dosage: '2 drops', frequency: 'As needed', duration: '5 days', instructions: 'Both nostrils' }
    ]
  }
};
