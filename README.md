# 🏥 CareConnect — Hospital & Appointment Management System

> **A Modern Full-Stack Enterprise Healthcare Platform** built with **Spring Boot (Java 17/21)**, **React.js (JSX)**, **Tailwind CSS**, **Spring Data JPA / Hibernate**, and **MySQL**.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features & User Roles](#-key-features--user-roles)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Database Design](#-database-design)
- [Directory Structure](#-directory-structure)
- [API Overview](#-api-overview)
- [Roadmap & Detailed Plan](#-roadmap--detailed-plan)
- [Getting Started](#-getting-started)
- [Default Credentials](#-default-credentials)

---

## 🌟 Overview

**CareConnect** is a comprehensive, production-ready hospital and clinical appointment management system. It bridges the gap between healthcare providers and patients by streamlining:
- Real-time doctor search and intelligent slot scheduling.
- Complete consultation lifecycle management (Requested ➔ Confirmed ➔ Completed / Cancelled).
- Digital prescription generation and consultation history.
- Verified doctor onboarding, hospital KPI analytics, and administrative auditing.

---

## 👥 Key Features & User Roles

### 👤 Patient Portal
- **Authentication**: Secure JWT-based self-registration and profile management.
- **Find Doctors**: Search & filter by department/specialization, years of experience, consultation fee, and patient ratings.
- **Smart Appointment Booking**: Dynamic slot picker (30-min intervals) reflecting real-time doctor availability.
- **Appointment Management**: Track status, view upcoming appointments, or cancel existing bookings.
- **Medical Records**: View and download digital prescriptions and consultation diagnosis.
- **Doctor Reviews**: Leave 1-5 star ratings and reviews for completed consultations.

### 👨‍⚕️ Doctor Portal
- **Consultation Dashboard**: Daily schedule overview, upcoming patient queue, and consultation stats.
- **Availability Scheduler**: Define weekly working hours, working days, and slot durations.
- **Appointment Workflow**: Accept, decline, or complete patient consultations.
- **Digital Prescription Composer**: Prescribe medicines with dosage, frequency, duration, and diagnosis advice.
- **Patient History**: Access past consultation history and medical notes for booked patients.

### 👨‍💼 Admin Command Center
- **Executive Analytics**: Real-time KPI counters (total patients, verified doctors, appointments, revenue).
- **Doctor Verification**: Review pending doctor profiles, credentials, and approve/suspend access.
- **Hospital Management**: Add and manage hospital medical departments.
- **Global Appointment Audit**: Full visibility over all appointments with search, filter, and status overrides.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (.jsx)                   │
│        Tailwind CSS + React Router v6 + Axios Interceptors  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / REST API (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                SPRING BOOT BACKEND (Java 17/21)             │
│  Security / JWT Filter ──► Controllers ──► Services         │
│                                └──► Repositories (JPA)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Hibernate / JDBC Pool (Hikari)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       MySQL DATABASE                        │
│          Users, Patients, Doctors, Appointments, etc.       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (`.jsx`), Tailwind CSS, React Router v6, Axios, Lucide Icons |
| **Backend** | Java 17 / 21, Spring Boot, Spring Security (Stateless JWT), Spring Data JPA |
| **ORM / Persistence** | Hibernate, HikariCP Connection Pooling |
| **Database** | MySQL 8.0+ |
| **Build & Tooling** | Maven, Vite / npm, Git |

---

## 🗄️ Database Design

```text
User (id, email, password, role)
 ├── Patient (user_id, name, phone, gender, blood_group, address)
 └── Doctor (user_id, department_id, name, phone, specialization, fee, status)
      │
      ├── DoctorAvailability (doctor_id, day_of_week, start_time, end_time, slot_duration)
      └── Appointments (patient_id, doctor_id, date, time, status, symptoms)
           │
           ├── Prescription (appointment_id, diagnosis, advice)
           │    └── PrescriptionItems (medicine, dosage, frequency, duration)
           └── Reviews (appointment_id, rating, comment)
```

---

## 📁 Directory Structure

```text
careconnect/
├── README.md                  # Project documentation & overview
├── plan.md                    # In-depth architectural master plan
│
├── careconnect-backend/       # Spring Boot Application
│   └── src/main/java/com/careconnect/
│       ├── controller/        # REST Endpoints
│       ├── service/           # Business logic & slot generation algorithms
│       ├── repository/        # Spring Data JPA interfaces
│       ├── entity/            # JPA Domain models
│       ├── dto/               # Request & Response payloads
│       ├── security/          # JWT Filters & Spring Security config
│       └── exception/         # Global Exception Handlers
│
└── careconnect-frontend/      # React Application (.jsx)
    └── src/
        ├── components/        # Reusable UI & domain components
        ├── pages/             # Public, Patient, Doctor & Admin pages
        ├── context/           # AuthContext & State management
        ├── services/          # Axios API clients
        └── routes/            # React Router protected routing
```

---

## 🔌 API Overview

### 🔑 Authentication
- `POST /api/auth/register` — Register new patient account
- `POST /api/auth/login` — Login & receive JWT authentication token
- `GET /api/auth/me` — Retrieve authenticated user profile

### 👨‍⚕️ Doctors & Slots
- `GET /api/doctors` — Public search with pagination & filters
- `GET /api/doctors/{id}` — Doctor details & reviews
- `GET /api/doctors/{id}/slots?date=YYYY-MM-DD` — Computed available booking slots
- `POST /api/doctor/availability` — Doctor schedule configuration

### 📅 Appointments
- `POST /api/patient/appointments` — Book new appointment slot
- `GET /api/patient/appointments` — Patient appointment history
- `PATCH /api/doctor/appointments/{id}/status` — Accept / Complete appointment
- `PATCH /api/patient/appointments/{id}/cancel` — Cancel appointment

### 💊 Prescriptions & Reviews
- `POST /api/prescriptions` — Create medical prescription & medicines
- `GET /api/prescriptions/{appointmentId}` — Retrieve consultation prescription
- `POST /api/patient/reviews` — Rate doctor consultation

### 🛡️ Admin
- `GET /api/admin/stats` — High-level hospital statistics
- `PATCH /api/admin/doctors/{id}/status` — Approve or reject doctor profile

---

## 📋 Roadmap & Detailed Plan

For the exhaustive step-by-step breakdown, component blueprints, DTOs, and full system specifications, refer to [**`plan.md`**](./plan.md).

---

## 🔐 Default Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@careconnect.com` | `Admin@123` |
| **Doctor** | `raj.kumar@careconnect.com` | `Doctor@123` |
| **Patient** | `rahul.sharma@careconnect.com` | `Patient@123` |

---

## 📄 License

This project is licensed under the MIT License.
